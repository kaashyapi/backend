const express = require("express");
const app = express();
const route = require("./route");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path")
const connectToDatabase = require("./config");
connectToDatabase();

const PORT = process.env.port;
const angularAppPath = process.env.angularAppPath;
const absolutePath = path.resolve(__dirname, angularAppPath, 'dist/frontend')
app.use("/frontend", express.static(absolutePath));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(absolutePath, 'index.html'));
});
const corsOptions = {
  origin: "https://main--techforum.netlify.app",
  methods: ["GET", "PATCH", "POST", "DELETE"],
  withCredentials: true,
  credentials: true,
  optionSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const allowCrossDomain = (req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://main--techforum.netlify.app"
  );
  res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
};
app.use(allowCrossDomain);
app.use(cors({ origin: true }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.options(
  "*",
  cors({
    origin: "https://main--techforum.netlify.app",
    credentials: true,
  })
);
app.use(route);
app.listen(PORT, () => {
  console.log("Server started");
});
