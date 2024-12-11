const router = require("express").Router();
const {
  uploadImages,
  uploadDisplayPicture,
} = require("../controllers/fileUpload.controller");
const { uploadMiddleware } = require("../middlewares/uploadHandler");

router.post(
  "/images",
  (req, res, next) => uploadMiddleware("images", 10)(req, res, next),
  uploadImages
);

router.post(
  "/display-image",
  (req, res, next) => uploadMiddleware("displayPicture")(req, res, next),
  uploadDisplayPicture
);

module.exports = router;
