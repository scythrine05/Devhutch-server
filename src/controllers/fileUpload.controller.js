const asyncHandler = require("../middlewares/asyncHandler");
const {
  uploadToS3Bucket,
  updateToS3Bucket,
} = require("../services/s3.service");
const userService = require("../services/user.service");
const { v4: uuidv4 } = require("uuid");
const { optimizeImage } = require("../utils/sharp.util");

exports.uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ error: "No files uploaded" });
  }
  const bucketId = uuidv4();
  const uploadPromises = req.files.map(async (file) => {
    const optimizedBuffer = await optimizeImage(file.buffer, "webp", 80);
    file.buffer = optimizedBuffer;
    return uploadToS3Bucket(file, `images/${bucketId}/`);
  });
  const uploadedURLs = await Promise.all(uploadPromises);
  res.status(200).send({ bucketId, uploadedURLs });
});

exports.updateImages = asyncHandler(async (req, res) => {
  const { urls, bucketId } = req.body;
  const files = req.files;
  if ((!urls || !files || files.length === 0) && !bucketId) {
    return res.status(400).send({ error: "Invalid input data" });
  }
  const optimizedFiles = await Promise.all(
    files.map(async (file) => {
      const optimizedBuffer = await optimizeImage(file.buffer);
      return { ...file, buffer: optimizedBuffer };
    })
  );
  const uploadedPromised = await updateToS3Bucket(
    JSON.parse(urls),
    optimizedFiles,
    bucketId
  );
  const uploadedURLs = await Promise.all(uploadedPromised);
  res.status(200).send({ uploadedURLs });
});

exports.uploadDisplayPicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }
  const optimizedBuffer = await optimizeImage(req.file.buffer, "webp", 90);
  req.file.buffer = optimizedBuffer;
  const publicUrl = await uploadToS3Bucket(
    req.file,
    `profile-pictures/${req.user.uid}/`
  );
  const updatedUser = await userService.updateProfileImage(
    req.user.uid,
    publicUrl
  );
  if (!updatedUser) {
    return res.status(404).send({ error: "User not found" });
  }
  res.status(200).send({ displayPicture: publicUrl, user: updatedUser });
});
