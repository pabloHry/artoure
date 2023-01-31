const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const healthcheckRouter = require("./routes/healthcheck.route");
const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const fileRouter = require("./routes/file.route");
module.exports = async (components) => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.use("/healthcheck", healthcheckRouter(components));
  app.use("/auth", authRouter(components));
  app.use("/user", userRouter(components));
  app.use("/file", fileRouter(components));

  return app;
};
