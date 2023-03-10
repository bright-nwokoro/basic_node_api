// import { createQueue } from "bullmq";
import bull from "bullmq";

// const { createQueue } = pkg;

import config from "config";

import S3Service from "../s3/index.js";

const s3Config = config.get("s3");

const s3Service = new S3Service();
const s3 = s3Service.client;

export const imageQueue = bull.createQueue("imageQueue");

export const handleImageUpload = async (job) => {
  const { key, entity, id } = job.data;

  try {
    const resizedImages = await Promise.all([
      sharp(
        await s3
          .getObject({ Bucket: s3Config.aws_bucket_name, Key: key })
          .promise()
      )
        .resize(200, 200)
        .toBuffer(),
      sharp(
        await s3
          .getObject({ Bucket: s3Config.aws_bucket_name, Key: key })
          .promise()
      )
        .resize(1280, 720)
        .toBuffer(),
      sharp(
        await s3
          .getObject({ Bucket: s3Config.aws_bucket_name, Key: key })
          .promise()
      )
        .resize(1920, 1080)
        .toBuffer(),
    ]);

    const resizedKeys = [
      {
        key: `${entity}/${id}/${key.split("/")[1]}/thumbnails/${
          key.split("/")[2]
        }`,
        buffer: resizedImages[0],
      },
      {
        key: `${entity}/${id}/${key.split("/")[1]}/720p/${key.split("/")[2]}`,
        buffer: resizedImages[1],
      },
      {
        key: `${entity}/${id}/${key.split("/")[1]}/1080p/${key.split("/")[2]}`,
        buffer: resizedImages[2],
      },
    ];

    await Promise.all(
      resizedKeys.map(async ({ key, buffer }) => {
        await s3
          .putObject({
            Bucket: s3Config.aws_bucket_name,
            Key: key,
            Body: buffer,
          })
          .promise();
      })
    );

    console.log("Images uploaded successfully");
  } catch (err) {
    console.error("Failed to resize and upload images", err);
    throw err;
  }
};
