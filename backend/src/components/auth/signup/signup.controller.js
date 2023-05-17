const User = require("../../../models/user");
const crypto = require("crypto");
require("dotenv").config();

module.exports = {
  signUp: async (req, res) => {
    const { firstName, lastName, emailId, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(401).json({
        status: 401,
        message: "Email address already in use"
      });
    }
    if (password.length < 6) {
      return res.status(401).json({
        status: 401,
        message: "Password must be at least 6 characters long"
      });
    }
    if (password !== confirmPassword) {
      return res.status(401).json({
        status: 401,
        message: "Password not matched"
      });
    }
    try {
      const salt = process.env.salt;
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: hashedPassword,
        userRole: process.env.userRole,
      });
      await user.save();
      res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: emailId,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: 500,
        message: "Server Error",
      });
    }
  },
};
