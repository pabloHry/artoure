const server = require("./http/server");
const config = require("../config");
const createComponents = require("./common/components/components");
const { connectToMongo } = require("./common/mongodb");

process.on("unhandledRejection", (e) =>
  console.log("An unexpected error occurred", e)
);
process.on("uncaughtException", (e) =>
  console.log("An unexpected error occurred", e)
);

(async function () {
  const mongodbClient = await connectToMongo();

  const components = await createComponents({
    db: mongodbClient.db,
  });
  const http = await server(components);
  http.listen(
    config.port,
    console.log(
      `${config.appName} - Server ready and listening on port ${config.port} `
    )
  );
})();
