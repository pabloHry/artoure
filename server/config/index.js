require("dotenv").config();
const env = require("env-var");

module.exports = {
  appName: env.get("RTP_API3_NAME").default("RTP API3").asString(),
  env: env.get("RTP_API3_ENV").required().asString(),
  server: env.get("RTP_API3_SERVER").required().asString(),
  port: env.get("RTP_API3_PORT").required().asIntPositive(),
  serverPort: env.get("RTP_API3_SERVER_PORT").required().asString(),
  AuthPasswordHashRounds: env
    .get("RTP_API3_AUTH_PASSWORD_HASH_ROUNDS")
    .required()
    .asInt(),
  mongodb: {
    uri: env.get("RTP_API3_MONGODB_URI").required().asString(),
  },
  log: {
    type: env.get("RTP_API3_LOG_TYPE").default("console").asString(),
    level: env.get("RTP_API3_LOG_LEVEL").default("info").asString(),
  },
  auth: {
    user: {
      jwtSecret: env.get("RTP_API3_AUTH_JWT_SECRET").asString(),
    },
  },
};
