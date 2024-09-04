const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const verifyToken = require("../middlewares/verifyToken");


//Error Handling
router.use((err, req, res, next) => {
  console.error("User Error:", err.message);
  res.status(400).json({ error: `User Error: ${err.message}` });
});


router.get("/check-username/:username", userController.checkUsernameExists);
router.get("/check-email/:email", userController.checkEmailExists);
router.post("/verify-captcha", userController.verifyRecaptchaToken);

router.use(verifyToken);


router.get("/:id", userController.getUserById);
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
