const router = require("express").Router();

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");

const accountRoutes = require("./account.route")
const projectRoutes = require("./project.route");

router.get("/", (req, res) => {
  res.send("Welcome to Devtiny Server");
});

//routes

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/account", accountRoutes);
router.use("/project", projectRoutes);

module.exports = router;
