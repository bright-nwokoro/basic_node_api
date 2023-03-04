import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const s3 = new AWS.S3({ signatureVersion: "v4" });

export const generateGetS3PresignedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${key}`,
    ResponseContentDisposition: "view",
    // Expires: 5 * 60,
  };

  if (!key) {
    return "No key was specified for this function.";
  }

  const url = await s3.getSignedUrlPromise("getObject", params);

  return {
    url: url,
  };
};

// delete s3 object
export const deleteS3Object = (key) => {
  const params = {
    Bucket: proccess.env.AWS_BUCKET_NAME,
    Key: key,
  };

  return s3.deleteObject(params).promise();
};
