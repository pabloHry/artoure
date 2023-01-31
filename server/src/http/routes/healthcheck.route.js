const express = require("express");
const config = require("../../../config");
const tryCatch = require("../middlewares/tryCatchMiddleware");
const packageJson = require("../../../package.json");

module.exports = ({ db }) => {
  const router = express.Router();

  router.get(
    "/",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await db
        .collection("users")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          console.log(e);
        });

      return res.json({
        name: `Serveur - ${config.appName}`,
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  return router;
};
