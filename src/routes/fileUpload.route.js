const router = require("express").Router();
const {
  uploadImages,
  updateImages,
  uploadDisplayPicture,
} = require("../controllers/fileUpload.controller");
const { uploadMiddleware } = require("../middlewares/uploadHandler");
const verifyToken = require("../middlewares/verifyToken");

//Error Handling
router.use((err, req, res, next) => {
  console.error("File upload Error:", err.message);
  res.status(400).json({ error: `File upload Error: ${err.message}` });
});

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
