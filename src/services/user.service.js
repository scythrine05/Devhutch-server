const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateRandomHex } = require("../utils/randomHex");

const createUser = async (userId, userData) => {
  const existingUser = await User.findById(userId);
  if (existingUser) return existingUser;

  //Check if username exist (Specially in Oauth)
  const username = userData.username;
  let modifiedUsername;
  const usernameExist = await checkUsernameExists(username);
  if (usernameExist) {
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

const checkUsernameExists = async (username) => {
  try {
    const count = await User.countDocuments({ username });
    return count > 0;
  } catch (error) {
    console.error("=> Error : username exist check: \n", error, "\n");
    throw error;
  }
};

const checkEmailExists = async (email) => {
  try {
    const count = await User.countDocuments({ email });
    return count > 0;
  } catch (error) {
    console.error("=> Error : email exist check: \n", error, "\n");
    throw error;
  }
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const getUserAccount = async (identifier) => {
  return await User.findOne({
    $or: [{ _id: identifier }, { username: identifier }],
  });
};

const getAllUsers = async () => {
  return await User.find();
};

module.exports = {
  createUser,
  getUserById,
  checkUsernameExists,
  checkEmailExists,
  updateUser,
  deleteUser,
  getUserAccount,
  getAllUsers,
};
