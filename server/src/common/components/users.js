const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../../../config");
const { UserModel, TokenModel } = require("../model");

module.exports = async () => {
  return {
    authenticate: async ({ email, password }) => {
      const user = await UserModel.findOne({ email });
      const isTokenAlreadyExist = await TokenModel.findOne({ user: user._id });

      const mapTokenOutputToApi = (token) => ({
        token: token.token,
        user: token.user,
      });

      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        if (isTokenAlreadyExist)
          return mapTokenOutputToApi(isTokenAlreadyExist.toObject());
        else {
          const token = jwt.sign(
            {
              id: user._id,
              email: user.email,
              pseudo: user.pseudo,
              username: user.username,
              password: user.password,
            },
            config.auth.user.jwtSecret,
            {
              expiresIn: "24h",
            }
          );

          const createToken = new TokenModel({
            token,
            user: user._id,
          });

          await createToken.save();
          return mapTokenOutputToApi(createToken.toObject());
        }
      }
    },
    getUser: (email) => UserModel.findOne({ email }),
    getAll: async () => {
      return await UserModel.find().lean();
    },
    createUser: async ({ username, pseudo, email, password }) => {
      password = await bcrypt.hash(password, config.AuthPasswordHashRounds);

      const user = new UserModel({
        username,
        email,
        password,
        pseudo,
        created_at: new Date(),
      });

      await user.save();
      return user.toObject();
    },
    removeUser: async ({ id }) => {
      console.log("awdwad", id);
      const user = await UserModel.findOne({ id });

      if (!user) return null;

      return await user.deleteOne({ id });
    },
    updateUser: async ({ id, email, username, password, pseudo }) => {
      const user = await UserModel.findOne({ id });
      if (!user) throw new Error(`Unable to find user`);

      const updated = await UserModel.findOneAndUpdate(
        user.email,
        {
          email: user.email === email ? user.email : email,
          username: user.username === username ? user.username : username,
          password: user.password === password ? user.password : password,
          pseudo: user.pseudo === pseudo ? user.pseudo : pseudo,
        },
        { new: true }
      );

      return updated;
    },
  };
};
