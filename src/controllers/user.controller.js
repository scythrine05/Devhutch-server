require("dotenv").config();
const axios = require("axios");
const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/user.service");

exports.verifyUniqueField = asyncHandler(async (req, res) => {
  const { field, value } = req.params;
  try {
    const count = await userService.countUserDocuments(field, value);
    count > 0 ? res.json({ exists: true }) : res.json({ exists: false });
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

exports.getUserByIdentifier = asyncHandler(async (req, res) => {
  const { field, value } = req.params;
  const user = await userService.getUserByIdentifier(field, value);
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
  res.status(200).json(users);
});
