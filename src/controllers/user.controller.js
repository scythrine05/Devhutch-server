require("dotenv").config();
const axios = require("axios");
const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/user.service");

exports.checkUsernameExists = asyncHandler(async (req, res) => {
  const username = req.params.username;
  try {
    const exists = await userService.checkUsernameExists(username);
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

exports.checkEmailExists = asyncHandler(async (req, res) => {
  const email = req.params.email;
  try {
    const exists = await userService.checkEmailExists(email);
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

exports.verifyRecaptchaToken = asyncHandler(async (req, res) => {
  const { captchaValue } = req.body;
  try {
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${captchaValue}`
    );
    res.send(data);
  } catch (error) {
    res.status(500).json({ msg: "Recaptcha Error" });
  }
});

exports.createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.user.uid, req.body);
  res.status(201).json(user);
});

exports.getUserById = asyncHandler(async (req, res) => {
  const currentUserId = req.user.uid;
  const user = await userService.getUserById(currentUserId);
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.json(user);
});

exports.updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUser(req.user.uid, req.body);
  if (!updatedUser) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.json(updatedUser);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await userService.deleteUser(req.user.uid);
  if (!deletedUser) {
    return res.status(404).json({ msg: "User not found" });
  }
  res.json({ msg: "User deleted" });
});

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
});
