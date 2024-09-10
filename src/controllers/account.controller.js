const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/user.service");

exports.getUserAccount = asyncHandler(async (req, res) => {
  const { field, value } = req.params;
  const user = await userService.getUserByIdentifier(field, value);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});
