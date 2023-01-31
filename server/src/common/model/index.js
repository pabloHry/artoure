const mongoose = require("mongoose");

const getModel = (modelName, { enablePagination = false } = {}) => {
  const Schema = require(`./schema/${modelName}`);
  enablePagination === true && Schema.plugin(require("mongoose-paginate"));
  return mongoose.model(modelName, Schema, modelName);
};

module.exports = {
  UserModel: getModel("users"),
  TokenModel: getModel("token"),
  FileModel: getModel("file"),
};
