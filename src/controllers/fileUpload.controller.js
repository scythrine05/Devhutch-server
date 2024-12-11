const { v4: uuidv4 } = require("uuid");
const { getStorage } = require("firebase-admin/storage");
const asyncHandler = require("../middlewares/asyncHandler");

const uploadToFirebase = async (file, folder = "") => {
  const storage = getStorage().bucket();
  const uniqueName = `${folder}${uuidv4()}-${file.originalname}`;
  const fileUpload = storage.file(uniqueName);

  await fileUpload.save(file.buffer, {
    contentType: file.mimetype,
  });

  return `https://storage.googleapis.com/${storage.name}/${uniqueName}`;
};

exports.uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ error: "No files uploaded" });
  }

  const uploadedURLs = await Promise.all(
    req.files.map((file) => uploadToFirebase(file, "images/"))
  );

  res.status(200).send(uploadedURLs);
});

exports.uploadDisplayPicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded" });
  }

  const publicUrl = await uploadToFirebase(req.file, "profile-pictures/");
  const updatedUser = await userService.updateProfileImage(
    req.user.uid,
    publicUrl
  );

  if (!updatedUser) {
    return res.status(404).send({ error: "User not found" });
  }

  res.status(200).send({ displayPicture: publicUrl, user: updatedUser });
});
