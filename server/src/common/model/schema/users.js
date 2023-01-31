const { Schema } = require("mongoose");

module.exports = new Schema({
  username: {
    type: String,
    description: "Username of user",
    default: null,
    required: true,
  },
  pseudo: {
    type: String,
    description: "Pseudo of user",
    default: null,
  },
  email: {
    type: String,
    description: "Email of user",
    default: null,
    required: true,
  },
  password: {
    type: String,
    required: true,
    default: null,
    description: "Password of user",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
