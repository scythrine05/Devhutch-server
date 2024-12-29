const sharp = require("sharp");

const optimizeImage = async (buffer, format = "webp", quality = 80) => {
  try {
    return await sharp(buffer)
      .resize({
        width: 1024,
        height: 1024,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      [format]({ quality })
      .toBuffer();
  } catch (error) {
    console.error("Error optimizing image:", error);
    throw new Error("Image optimization failed.");
  }
};

module.exports = {
  optimizeImage,
};
