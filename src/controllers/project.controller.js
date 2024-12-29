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
  await projectService.deleteUserIdFromHypes(userId);
  const response = await projectService.deleteProjectsByUserId(userId);
  res.status(200).json(response);
});
