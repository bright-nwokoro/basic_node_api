import config from "config";
import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

import dotenv from "dotenv";
dotenv.config();

class S3Service {
  constructor() {
    // Get the S3 configuration from the config file
    const s3Config = config.get("s3");

    // console.log(s3Config)

    // Create an S3 client based on the environment
    if (config.get("env_name") === "dev") {
      this.s3Client = new S3Client({
        endpoint: "http://localstack:4566",
        forcePathStyle: true,
        region: s3Config.region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
    } else {
      this.s3Client = new S3Client({
        region: s3Config.region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
      });
    }
  }

  getMulterS3Storage(bucketName) {
    // Create the multer-s3 storage using the S3 client and bucket name
    const storage = multerS3({
      s3: this.s3Client,
      bucket: bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      acl: 'public-read',
      key: (req, file, cb) => {
        const currentDate = Date.now();
        const date = new Date(currentDate);
        const dateString = date.toISOString().replace(/[\/\\:]/g, "_");
        const uniqueSuffix = dateString + "-" + Math.round(Math.random() * 1e9);

        const fullPath =
          `${file.fieldname}/${uniqueSuffix}-` +
          req.id +
          path.extname(file.originalname);

        cb(null, fullPath);
      },
    });

    return storage;
  }

  imageFileFilter = (req, file, callback) => {
    const fileTypes = /jpeg|jpg|png|gif/;

    const extensionName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimeType = fileTypes.test(file.mimetype);

    if (extensionName && mimeType) {
      callback(null, true);
    } else {
      callback(null, false);
    }

    if (file.size === 0) {
      callback(null, false);
    }
  };

  getMulterUploadMiddleware() {
    // Initialize multer with the multer-s3 storage
    const upload = multer({
      fileFilter: this.imageFileFilter,
      storage: this.getMulterS3Storage("test-user-images"),
      limits: {
        fileSize: 3000000,
      },
    });

    return upload;
  }

  async deleteAllObjects(bucketName, region) {
    const s3Client = new S3Client({ region: region });

    // Get a list of all objects in the bucket
    const listParams = { Bucket: bucketName };
    const listResponse = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );
    const objects = listResponse.Contents.map(({ Key }) => ({ Key }));

    // Delete all objects in the bucket
    if (objects.length > 0) {
      const deleteParams = { Bucket: bucketName, Delete: { Objects: objects } };
      await s3Client.send(new DeleteObjectsCommand(deleteParams));
    }
  }

  get client() {
    return this.s3Client;
  }
}

export default S3Service;