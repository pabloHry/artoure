const { connectToMongo } = require("../mongodb");
const createUsers = require("./users");
const createFile = require("./file");

module.exports = async (options = {}) => {
  const users = options.users || (await createUsers());
  const file = options.users || (await createFile());
  return {
    users,
    file,
    db: options.db || (await connectToMongo()).db,
  };
};
