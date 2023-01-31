const { Schema } = require("mongoose");

module.exports = new Schema({
  name: {
    type: String,
    description: "name of file",
    default: null,
  },
  path: {
    type: String,
    description: "Path of file",
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
