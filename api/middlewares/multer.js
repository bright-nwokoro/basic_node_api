import config from "config";
import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

// import dotenv from "dotenv";
// dotenv.config();

import User from "../model/user/index.js";
import Dog from "../model/dog/index.js";

const env = config.get("env_name");
const s3Config = config.get("s3");

const localstackS3Options = {
  endpoint: "http://localstack:4566",
  forcePathStyle: true,
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.aws_access_key_id,
    secretAccessKey: s3Config.aws_secret_access_key,
  },
};
const s3CloudOptions = {
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.aws_access_key_id,
    secretAccessKey: s3Config.aws_secret_access_key,
  },
};

class S3MulterService {
  constructor() {
    this.s3Client = new S3Client(
      env === "dev" ? localstackS3Options : s3CloudOptions
    );
  }

  getMulterS3Storage(bucketName) {
    const storage = multerS3({
      s3: this.s3Client,
      bucket: bucketName,
      acl: "public",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      acl: "public-read",
      key: async (req, file, cb) => {
        const userId = req.body.userid;
        const user = await User.findOne({ id: userId });

        const dogId = req.body.dogid;
        const dog = await Dog.findOne({ id: dogId });

        const id = userId ? (userId && user ? userId : "undefined") : (dogId && dog ? dogId : "undefined");

        const currentDate = Date.now();
        const date = new Date(currentDate);
        const dateString = date.toISOString().replace(/[\/\\:]/g, "_");
        const uniqueSuffix = dateString + "-" + Math.round(Math.random() * 1e9);

        const fullPath =
          `${file.fieldname}/${id}/${uniqueSuffix}` +
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
      // limits: {
      //   fileSize: 3000000,
      // },
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

export default S3MulterService;
