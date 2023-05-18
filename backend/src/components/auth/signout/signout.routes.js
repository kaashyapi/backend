const express = require("express");
const signoutRoutes = express.Router();

signoutRoutes.post("/signout", (req, res) => {
  res.clearCookie("email", { path: `'https://techforumbackend-yf2m.onrender.com/forgotpassword'` });
  res.clearCookie("jwt", { path: `'https://techforumbackend-yf2m.onrender.com/users'` }).status(200).json({
    status: 200,
    message: "Signed out successfully",
  });
});

module.exports = signoutRoutes;
