const multer = require("multer");

const uploadMiddleware = (fieldName, maxCount = 1) => {
  const upload = multer({
    storage: multer.memoryStorage(),
  });

  return maxCount > 1
    ? upload.array(fieldName, maxCount)
    : upload.single(fieldName);
};

module.exports = { uploadMiddleware };
