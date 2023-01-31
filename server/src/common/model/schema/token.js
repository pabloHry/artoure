const { Schema } = require("mongoose");

module.exports = new Schema({
  token: {
    type: String,
    description: "Username of user",
    default: null,
  },
  user: {
    type: String,
    description: "Id of user",
    default: null,
  },
});
