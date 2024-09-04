exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure this matches the same options used when setting the cookie
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Successful logout" });
};
  