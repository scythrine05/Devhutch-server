const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const verifyToken = require("../middlewares/verifyToken");

//Error Handling
router.use((err, req, res, next) => {
  console.error("User Error:", err.message);
  res.status(400).json({ error: `User Error: ${err.message}` });
});

router.get(
  "/verify-unique-field/:field/:value",
  userController.verifyUniqueField
);
router.post("/verify-captcha", userController.verifyRecaptchaToken);

router.use(verifyToken);

router.get("/:field/:value", userController.getUserByIdentifier);
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.put("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);

module.exports = router;
