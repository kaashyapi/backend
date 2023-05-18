const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return await res.status(401).json({
      status: 401,
      message: "Need to Sign In",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.jwtSecret);
    req.userId = decode.userId;
  } catch (err) {
    return res.status(401).json({
      status: 401,
      message: "You are not authorized",
    });
  }
  return next();
};
