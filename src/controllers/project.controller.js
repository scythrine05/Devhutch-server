const asyncHandler = require("../middlewares/asyncHandler");
const projectService = require("../services/project.service");

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
