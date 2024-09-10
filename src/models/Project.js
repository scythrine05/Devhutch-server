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
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      //required: true,
    },
    description: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
