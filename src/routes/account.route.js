const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");

const verifyToken = require("../middlewares/verifyToken");


//Error Handling
router.use((err, req, res, next) => {
  console.error("Account Error:", err.message);
  res.status(400).json({ error: `Account Error: ${err.message}` });
});

router.use(verifyToken);


router.get("/:identifier", accountController.getUserAccount);

module.exports = router;
