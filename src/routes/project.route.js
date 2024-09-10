const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");

const projectController = require("../controllers/project.controller");

//Error Handling
router.use((err, req, res, next) => {
  console.error("Project Error:", err.message);
  res.status(400).json({ error: `Project Error: ${err.message}` });
});

router.use(verifyToken);

router.get("/", projectController.getAllProjects);
router.get("/user/:userId", projectController.getProjectsByUserId);
router.post("/", projectController.createProject);

module.exports = router;
