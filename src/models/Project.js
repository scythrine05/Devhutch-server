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
      //required: true,
    },
    links: {
      type: [
        {
          name: { type: String /*required: true*/ },
          url: { type: String /*required: true*/ },
        },
      ],
      //required: true,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
      required: true,
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
