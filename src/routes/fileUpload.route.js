const router = require("express").Router();
const {
  uploadImages,
  updateImages,
  uploadDisplayPicture,
} = require("../controllers/fileUpload.controller");
const { uploadMiddleware } = require("../middlewares/uploadHandler");
const verifyToken = require("../middlewares/verifyToken");

router.use(verifyToken);

router.post(
  "/images",
  (req, res, next) => uploadMiddleware("images", 5)(req, res, next),
  uploadImages
);
router.put(
  "/images",
  (req, res, next) => uploadMiddleware("images", 5)(req, res, next),
  updateImages
);
router.post(
  "/display-image",
  (req, res, next) => uploadMiddleware("displayPicture")(req, res, next),
  uploadDisplayPicture
);

module.exports = router;
