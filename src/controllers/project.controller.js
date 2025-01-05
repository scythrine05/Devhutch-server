require("dotenv").config();

const asyncHandler = require("../middlewares/asyncHandler");
const projectService = require("../services/project.service");
const userService = require("../services/user.service");
const {
  listFromS3Bucket,
  deleteFromS3Bucket,
} = require("../services/s3.service");

exports.createProject = asyncHandler(async (req, res) => {
  const response = await projectService.createProject(req.user.uid, req.body);
  res.status(201).json(response);
});

exports.getAllProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjects();
  res.status(200).json(projects);
});

exports.getProjectsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const projects = await projectService.getProjectsByUserId(userId);
  res.status(200).json(projects);
});

exports.getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await projectService.getProjectById(projectId);
  res.status(200).json(project);
});

exports.updateProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const updatedData = req.body;
  const updatedProject = await projectService.updateProjectById(
    projectId,
    updatedData
  );
  res.status(200).json(updatedProject);
});

exports.deleteProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const projectData = await projectService.getProjectById(projectId);

  const imageBucketId = projectData.imageBucketId;
  const folderPath = `images/${imageBucketId}/`;
  const objectKeys = await listFromS3Bucket(folderPath);

  if (objectKeys.length > 0) {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Delete: {
        Objects: objectKeys.map((key) => ({ Key: key })),
      },
    };
    await deleteFromS3Bucket(deleteParams);
  }

  await projectService.deleteProjectById(projectId);
  res.status(200).json({ message: "Project deleted successfully." });
});

exports.projectHypeById = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.body;
  const response = await projectService.projectHypeById(projectId, userId);
  res.status(201).json(response);
});

exports.isProjectHypedByUser = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;
  const response = await projectService.isProjectHypedByUser(projectId, userId);
  res.status(201).json(response);
});

exports.deleteAllProjectsByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const projects = await projectService.getProjectsByUserId(userId);

  //Delete project images from bucket
  for (const project of projects) {
    const imageBucketId = project.imageBucketId;
    const folderPath = `images/${imageBucketId}/`;
    const objectKeys = await listFromS3Bucket(folderPath);
    if (objectKeys.length > 0) {
      const deleteParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Delete: {
          Objects: objectKeys.map((key) => ({ Key: key })),
        },
      };
      await deleteFromS3Bucket(deleteParams);
    }
  }

  //Delete profile images from bucket
  const existingProfileUrl = await userService.getProfileImage(userId);
  if (existingProfileUrl) {
    const key = `profile-pictures/${req.user.uid}/${
      existingProfileUrl.split(`${req.user.uid}/`)[1]
    }`;
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };
    await deleteFromS3Bucket(deleteParams, false);
  }

  await projectService.deleteUserIdFromHypes(userId);
  const response = await projectService.deleteAllProjectsByUserId(userId);

  res.status(200).json(response);
});
