const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/user.service");

exports.getUserAccount = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const user = await userService.getUserAccount(identifier);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});
