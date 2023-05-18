const User = require("../../../models/user");
const UserRole = require("../../../models/userRole");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

module.exports = {
  signIn: async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const salt = process.env.salt;
      const user = await User.findOne({ emailId });
      if (!user) {
        res.status(401).json({
          status: 401,
          message: "Incorrect Email or password",
        });
      } else {
        const hashedPassword = crypto
          .pbkdf2Sync(password, salt, 1000, 64, "sha512")
          .toString("hex");

        if (hashedPassword === user.password) {
          const token = jwt.sign({ userId: user._id }, process.env.jwtSecret);
          const expirationTime = new Date(Date.now() + 12 * 60 * 60 * 1000);
          res
            .cookie("jwt", token, {
              httpOnly: true,
              path: "/users",
              expires: expirationTime,
              sameSite: "none",
              secure: true,
            })
            .status(200)
            .json({
              status: 200,
              message: "Signed in successfully",
              data: {
                _id: user._id,
                role: user.userRole,
                name: user.firstName + " " + user.lastName,
              },
            });
        } else {
          res.status(401).json({
            status: 401,
            message: "Incorrect Email or password",
          });
        }
      }
    } catch (err) {
      return res.status(500).json({
        status: 500,
        message: "Server Error",
      });
    }
  },

  userRole: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findOne({ _id: id });
      const role = user.userRole;
      const userRole = await UserRole.findOne({ _id: role });
      return res.status(200).json({
        status: 200,
        userRole: userRole.roleName,
      });
    } catch (err) {
      if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(400).json({
          status: 400,
          message: "Invalid Id ",
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Internal Server Error: " + err.message,
        });
      }
    }
  },
};
