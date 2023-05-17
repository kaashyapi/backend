const express = require("express");
const signoutRoutes = express.Router();

signoutRoutes.post("/signout", (req, res) => {
  res.clearCookie("email", { path: "/forgotpassword" });
  res.clearCookie("jwt", { path: "/users" }).status(200).json({
    status: 200,
    message: "Signed out successfully",
  });
});

module.exports = signoutRoutes;
