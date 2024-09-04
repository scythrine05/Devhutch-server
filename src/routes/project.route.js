const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Devtiny Project System");
});

module.exports = router;
