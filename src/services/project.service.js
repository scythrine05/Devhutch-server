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
        authorProfileImage: user ? user.profileImage : null,
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
    authorProfileImage: user ? user.profileImage : null,
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

const deleteAllProjectsByUserId = async (userId) => {
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

const deleteProjectById = async (projectId) => {
  return await Project.findByIdAndDelete(projectId);
};

const updateProjectById = async (projectId, updateData) => {
  return await Project.findByIdAndUpdate(
    projectId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  getProjectsByUserId,
  projectHypeById,
  deleteProjectById,
  updateProjectById,
  isProjectHypedByUser,
  deleteAllProjectsByUserId,
  deleteUserIdFromHypes,
};
