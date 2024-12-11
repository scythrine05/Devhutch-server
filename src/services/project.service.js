const Project = require("../models/Project");
const mongoose = require("mongoose");
const { getUserByIdentifier } = require("./user.service");

const createProject = async (userId, projectData) => {
  const newProject = new Project({
    _id: new mongoose.Types.ObjectId(),
    ...projectData,
    authorId: userId,
  });
  return await newProject.save();
};

const getAllProjects = async () => {
  const projects = await Project.find();

  // Fetch and append the user details
  const projectsWithUsernames = await Promise.all(
    projects.map(async (project) => {
      const projectData = project.toObject();
      const user = await getUserByIdentifier("userId", project.authorId);
      return {
        ...projectData,
        authorUsername: user ? user.username : "Unknown",
      };
    })
  );
  return projectsWithUsernames;
};

const getProjectsByUserId = async (userId) => {
  return await Project.find({ authorId: userId });
};

const getProjectById = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const projectData = project.toObject();
  const user = await getUserByIdentifier("userId", project.authorId);
  return {
    ...projectData,
    authorUsername: user ? user.username : "Unknown",
  };
};

const projectHypeById = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const hypeIndex = project.hypes.findIndex((hype) => hype.userId === userId);

  if (hypeIndex !== -1) {
    project.hypes.splice(hypeIndex, 1);
  } else {
    project.hypes.push({ userId });
  }

  return await project.save();
};

const isProjectHypedByUser = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const isHype = project.hypes.some((hype) => hype.userId === userId);
  return { isHype };
};

const deleteProjectsByUserId = async (userId) => {
  const count = await Project.countDocuments({ authorId: userId });
  if (count === 0) {
    return;
  } else {
    return await Project.deleteMany({ authorId: userId });
  }
};

const deleteUserIdFromHypes = async (userId) => {
  const result = await Project.updateMany(
    { "hypes.userId": userId },
    { $pull: { hypes: { userId: userId } } }
  );

  if (result.modifiedCount === 0) {
    return;
  }
  return;
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByUserId,
  projectHypeById,
  isProjectHypedByUser,
  deleteProjectsByUserId,
  deleteUserIdFromHypes,
};
