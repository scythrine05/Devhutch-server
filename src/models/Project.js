const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    links: {
      type: [
        {
          name: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
    },
    imageUrls: {
      type: [String],
      required: true,
    },
    imageBucketId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    authorId: {
      type: String,
      required: true,
    },
    hypes: {
      type: [{ userId: { type: String } }],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProjectSchema.virtual("hypeCount").get(function () {
  return this.hypes.length;
});

module.exports = mongoose.model("Project", ProjectSchema);
