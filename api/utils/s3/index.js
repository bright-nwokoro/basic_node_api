import AWS from "aws-sdk";
import config from "config";
import dotenv from "dotenv";

dotenv.config();

const env = config.get("env_name");
const s3Config = config.get("s3");

const localstackS3Options = {
  endpoint: s3Config.s3_endpoint,
  s3ForcePathStyle: true,
  region: s3Config.region,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const s3CloudOptions = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: s3Config.region,
};

AWS.config.update(env === "dev" ? localstackS3Options : s3CloudOptions);

const s3 = new AWS.S3({ signatureVersion: "v4" });

const bucketName = s3Config.aws_bucket_name;

class S3Service {
  constructor() {
    this.s3 = s3;
  }

  createS3Bucket = () => {
    this.s3.createBucket({ Bucket: bucketName }, function (err, data) {
      if (err) {
        console.log(`Error creating bucket: ${err}`);
        return false;
      } else {
        console.log(`Bucket ${bucketName} created successfully`);
        return true;
      }
    });
  };

  isS3BucketNameExist = () => {
    return new Promise((resolve, reject) => {
      this.s3.listBuckets((err, data) => {
        if (err) {
          console.log(`Error listing buckets: ${err}`);
          reject("error");
        } else {
          const bucketExists = data.Buckets.some(
            (bucket) => bucket.Name === bucketName
          );

          if (bucketExists) {
            console.log(`Bucket ${bucketName} exists`);
            resolve("yes");
          } else {
            console.log(`Bucket ${bucketName} does not exist`);
            resolve("does not exist");
          }
        }
      });
    });
  };

  deleteS3Bucket = () => {
    return new Promise((resolve, reject) => {
      this.s3.deleteBucket({ Bucket: bucketName }, function (err, data) {
        if (err) {
          console.log(`Error deleting bucket: ${err}`);
          reject("error");
        } else {
          console.log(`Bucket ${bucketName} deleted successfully`);
          resolve("yes");
        }
      });
    });
  };

  generatePresignedUrl = (key) => {
    const params = {
      Bucket: bucketName,
      Key: key,
      ResponseContentDisposition: "view",
      Expires: 60 * 60, // URL expires in 1 hour
    };

    return this.s3.getSignedUrlPromise("getObject", params);
  };

  deletes3Bucket = (key) => {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    return s3.deleteObject(params).promise();
  };
}

export default S3Service;
