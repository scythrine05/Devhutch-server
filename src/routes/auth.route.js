const router = require("express").Router();
const admin = require("firebase-admin");
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");



router.use(verifyToken);
//Error Handling
router.use((err, req, res, next) => {
  console.error("Auth Error:", err.message);
  res.status(400).json({ error: `Auth Error: ${err.message}` });
});

router.get("/set-token", (req, res) => {
  res.status(200).json({ message: "Token Set" });
});

router.get("/check-token", (req, res) => {
  console.log(req.user.uid);
  res.status(200).json({ message: "Token valid" });
});

router.delete("/logout", authController.logout);
// router.post("/reset-password", authController.resetPassword);

module.exports = router;
