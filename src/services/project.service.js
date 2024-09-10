const Project = require("../models/Project");
const mongoose = require("mongoose");

exports.createProject = async (userId, projectData) => {
  const newProject = new Project({
    _id: new mongoose.Types.ObjectId(),
    ...projectData,
    authorId: userId,
  });

  return await newProject.save();
};

exports.getAllProjects = async () => {
  return await Project.find();
};

exports.getProjectsByUserId = async (userId) => {
  return await Project.find({ authorId: userId });
};
