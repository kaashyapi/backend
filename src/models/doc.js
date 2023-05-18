const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },

  fileName: {
    type: String,
  },

  fileType: {
    type: String,
  },

  docData: {
    type: Buffer,
  },

  isApproved: {
    type: Boolean,
    default: false,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model("document", docSchema);
