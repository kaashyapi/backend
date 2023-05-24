const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  title: {
    type: String,
    trim: true,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },

  createdDate: {
    type: Date,
  },

  updatedDate: {
    type: Date,
  },
});

module.exports = new mongoose.model("blog", blogSchema);
