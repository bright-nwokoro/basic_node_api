import { Queue, Worker } from "bullmq";
import config from "config";
import Redis from "ioredis";
import multer from "multer";
import stream from "stream";
import path from "path";
import sharp from "sharp";

import User from "../../model/user/index.js";
import S3Service from "../../utils/s3/index.js";

const env = config.get("env_name");
const s3Config = config.get("s3");
const redisConfig = config.get("task.redis");

const s3Service = new S3Service();
const s3 = s3Service.client;

const devRedisOptions = {
  host: redisConfig.host,
  port: redisConfig.port,
  maxRetriesPerRequest: null,
};

const redisOptions = {
  port: redisConfig.port,
  maxRetriesPerRequest: null,
};

const redisClient = new Redis(env === "dev" ? devRedisOptions : redisOptions);

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
        const { files, id } = job.data;

        const currentDate = Date.now();
        const date = new Date(currentDate);
        const dateString = date.toISOString().replace(/[\/\\:]/g, "_");
        const uniqueSuffix = dateString + "-" + Math.round(Math.random() * 1e9);

        const keys = [];
        let resize_key;

        // let user, dog;

        // switch (`${this.field}`) {
        //   case "users":
        //     const userId = id;

        //     user = await User.findOne({
        //       id: userId,
        //     });

        //     if (!user) {
        //       return res.status(400).json({
        //         data: "",
        //         message: "Invalid user",
        //       });
        //     }
        //     break;
        //   case "dogs":
        //     break;
        // }

        try {
          for (const file of files) {
            const s3Params = {
              Bucket: s3Config.aws_bucket_name,
              Key:
                `${this.field}/${id}/${uniqueSuffix}` +
                path.extname(file.originalname),
              ACL: "public-read",
            };

            // Create a Readable stream of the uploaded file
            const bufferStream = new stream.PassThrough();
            bufferStream.end(Buffer.from(file.buffer.data));

            // Resize image using sharp
            const sharpStream = sharp();
            bufferStream.pipe(sharpStream);

            // Resize image and upload as a stream
            const thumbnailStream = sharpStream
              .clone()
              .resize(150, 150)
              .toFormat("jpeg")
              .pipe(new stream.PassThrough());
            const mediumStream = sharpStream
              .clone()
              .resize(720, 720)
              .toFormat("jpeg")
              .pipe(new stream.PassThrough());
            const largeStream = sharpStream
              .clone()
              .resize(1080, 1080)
              .toFormat("jpeg")
              .pipe(new stream.PassThrough());

            s3Params.Body = bufferStream; // Set the Body parameter to the Readable stream of the uploaded file

            const result = await s3.upload(s3Params).promise();

            keys.push(result);

            console.log(`File uploaded successfully! URL: ${result.Location}`);

            // Upload resized images to S3
            const thumbnailParams = {
              ...s3Params,
              Key: s3Params.Key.replace(
                path.extname(file.originalname),
                "_thumb.jpg"
              ),
            };
            const mediumParams = {
              ...s3Params,
              Key: s3Params.Key.replace(
                path.extname(file.originalname),
                "_720.jpg"
              ),
            };
            const largeParams = {
              ...s3Params,
              Key: s3Params.Key.replace(
                path.extname(file.originalname),
                "_1080.jpg"
              ),
            };

            thumbnailParams.Body = thumbnailStream; // Set the Body parameter to the Readable stream of the resized image
            mediumParams.Body = mediumStream;
            largeParams.Body = largeStream;

            const resize_result = await Promise.all([
              s3.upload(thumbnailParams).promise(),
              s3.upload(mediumParams).promise(),
              s3.upload(largeParams).promise(),
            ]);

            resize_key = resize_result;

            console.log(
              `Resized File uploaded successfully! URL: ${resize_result.map(
                (key) => {
                  key.Location;
                }
              )}`
            );
          }

          console.log("keys", keys);
          console.log("resize_keys", resize_key);

          // const allImages = [
          //   keys.map((key) => {
          //     key.Key;
          //   }),
          //   resize_key.map((key) => {
          //     key.Key;
          //   }),
          // ];

          // switch (`${this.field}`) {
          //   case "users":
          //     const user = await User.findOne({ id: id });
          //     user.profileImages = allImages;
          //     await user.save();

          //     console.log("User profile image has been saved")
          //     break;
          // }
        } catch (err) {
          console.error(`Error uploading file: ${err}`);
          throw err;
        }
      },
      { connection: redisClient }
    );
  }

  async addImageToQueue(req, res) {
    multer().array(`${this.field}`)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          data: err,
          message: "Unable to upload file",
        });
      }

      const files = req.files;
      const id = req.body.id;

      if (!req.files) {
        return res.status(400).json({
          data: "",
          message: "Unsupported Image format.",
        });
      }

      // switch (`${this.field}`) {
      //   case "users":
      //     const userId = req.body.id;

      //     const user = await User.findOne({
      //       id: userId,
      //     });

      //     if (!user) {
      //       return res.status(400).json({
      //         data: "",
      //         message: "Invalid user",
      //       });
      //     }
      //     break;
      //   case "dogs":
      //     break;
      // }

      const job = await this.queue.add("upload", { files, id });
      res.status(200).json({
        data: {
          job_id: `${job.id}`,
        },
        message: "Image File is now being uploaded!",
      });
    });
  }
}

export default ImageUploader;
