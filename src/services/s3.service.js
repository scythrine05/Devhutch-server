const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
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
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3.");
  }
};

const deleteFromS3Bucket = async (url, bucketId) => {
  const key = `${bucketId}/${url.split(`${bucketId}/`)[1]}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error("Failed to delete file from S3.");
  }
};

const updateToS3Bucket = async (urls, newFiles, bucketId) => {
  try {
    const deletePromises = urls.map(
      async (url) => await deleteFromS3Bucket(url, bucketId)
    );
    await Promise.all(deletePromises);

    const uploadPromises = newFiles.map(
      async (file) => await uploadToS3Bucket(file, `images/${bucketId}`)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error updating S3 objects:", error);
    throw new Error("Failed to update S3 objects.");
  }
};

module.exports = {
  uploadToS3Bucket,
  updateToS3Bucket,
  deleteFromS3Bucket,
};
