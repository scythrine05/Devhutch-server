const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateRandomHex } = require("../utils/randomHex");

const createUser = async (userId, userData) => {
  const existingUser = await User.findById(userId);
  if (existingUser) return existingUser;

  const username = userData.username;
  let modifiedUsername;
  const usernameCount = await countUserDocuments("username", username);
  if (usernameCount > 0) {
    const randomHex = generateRandomHex();
    modifiedUsername = `${username}${randomHex}`; //Modify Username
  }
  // Hash the password before saving the user
  const hashedPassword = await bcrypt.hash(userData.password, 10); // bcrypt hashing
  const newUser = new User({
    _id: userId,
    ...userData,
    username: modifiedUsername || username,
    password: hashedPassword, // Store the hashed password
  });

  return await newUser.save();
};

const countUserDocuments = async (field, value) => {
  try {
    const count = await User.countDocuments({ [field]: value });
    return count;
  } catch (err) {
    throw err;
  }
};

const updateUser = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

const getProfileImage = async (userId) => {
  const user = await User.findById(userId).select("profileImage");
  return user ? user.profileImage : null;
};

const updateProfileImage = async (userId, imageUrl) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { profileImage: imageUrl },
    { new: true }
  );
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const getUserByIdentifier = async (field, value) => {
  const query = field === "userId" ? { _id: value } : { username: value };
  return await User.findOne(query);
};

const getAllUsers = async () => {
  return await User.find();
};

module.exports = {
  createUser,
  countUserDocuments,
  updateUser,
  deleteUser,
  getUserByIdentifier,
  getAllUsers,
  updateProfileImage,
  getProfileImage,
};
