require("dotenv").config();

const {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectCommand,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");
const { v4: uuidv4 } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 30000,
    socketTimeout: 30000,
  }),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3Bucket = async (file, folder) => {
  const extension = file.mimetype.split("/")[1];
  const fileKey = `${folder}/${uuidv4()}.${extension}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  } catch (error) {
    throw new Error(`Failed to upload file to S3 : ${error}`);
  }
};

const deleteFromS3Bucket = async (deleteParams, multiple = true) => {
  try {
    const command = multiple
      ? new DeleteObjectsCommand(deleteParams)
      : new DeleteObjectCommand(deleteParams);
    await s3.send(command);
  } catch (error) {
    throw new Error(`Failed to delete file from S3: ${error}`);
  }
};

const updateToS3Bucket = async (removedUrls, newFiles, bucketId) => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: removedUrls.map((removedUrl) => ({
          Key: `images/${bucketId}/${removedUrl.split(`${bucketId}/`)[1]}`,
        })),
      },
    };
    if (deleteParams.Delete.Objects.length > 0) {
      await deleteFromS3Bucket(deleteParams);
    }
    const uploadPromises = newFiles.map(
      async (file) => await uploadToS3Bucket(file, `images/${bucketId}`)
    );

    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Failed to update S3 objects: ${error.message}`);
  }
};

const listFromS3Bucket = async (folder) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: folder,
  };
  try {
    const command = new ListObjectsCommand(params);
    const response = await s3.send(command);
    const keys = response.Contents?.map((item) => item.Key) || [];
    return keys;
  } catch (error) {
    throw new Error(`Failed to list objects from S3: ${error}`);
  }
};

module.exports = {
  uploadToS3Bucket,
  updateToS3Bucket,
  deleteFromS3Bucket,
  listFromS3Bucket,
};
