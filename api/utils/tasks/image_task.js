import { Queue, Worker } from "bullmq";
import config from "config";
import Redis from "ioredis";
import multer from "multer";
import stream from "stream";
import path from "path";

import User from "../../model/user/index.js";
import S3Service from "../../utils/s3/index.js";

const s3Config = config.get("s3");
const redisConfig = config.get("task.redis");

const s3Service = new S3Service();
const s3 = s3Service.client;

const redisClient = new Redis({
  host: redisConfig.host,
  port: redisConfig.port,
  maxRetriesPerRequest: null,
});

class ImageUploader {
  constructor(queueName, multerField) {
    this.field = multerField;
    this.queue = new Queue(queueName, {
      connection: redisClient,
    });

    // create a worker to handle the upload task
    this.worker = new Worker(
      queueName,
      async (job) => {
        const { file, id } = job.data;

        try {
          const s3Params = {
            Bucket: s3Config.aws_bucket_name,
            Key: `${this.field}/${id}` + Date.now().toString() + path.extname(file.originalname),
            ACL: "public-read",
          };

          // Create a Readable stream of the uploaded file
          const bufferStream = new stream.PassThrough();
          bufferStream.end(file.buffer);

          s3Params.Body = bufferStream; // Set the Body parameter to the Readable stream of the uploaded file

          const result = await s3.upload(s3Params).promise();

          console.log(`File uploaded successfully! URL: ${result.Location}`);
        } catch (err) {
          console.error(`Error uploading file: ${err}`);
          throw err;
        }
      },
      { connection: redisClient }
    );
  }

  async addImageToQueue(req, res, next) {
    multer().array(`${this.field}`)(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      try {
        const file = req.files;
        const id = req.body.id;

        const job = await this.queue.add("upload", { file, id });
        res.status(200).send(`File uploaded successfully! Job ID: ${job.id}`);
      } catch (err) {
        next(err);
      }
    });
  }
}

export default ImageUploader;
