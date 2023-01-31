const mongoose = require("mongoose");
const config = require("../../config");

const mongooseInstance = mongoose;

module.exports.connectToMongo = (mongoUri = config.mongodb.uri) => {
  return new Promise((resolve, reject) => {
    console.log(`MongoDB: Connection to ${mongoUri}`);
    // Set up default mongoose connection
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, // otherwise Mongoose will build indexes everytime the application starts up
    });

    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise; // Get the default connection
    const db = mongoose.connection;

    // Bind connection to error event (to get notification of connection errors)
    db.on("error", (e) => {
      console.log(e, "MongoDB: connection error:");
      reject(e);
    });

    db.once("open", () => {
      console.log("MongoDB: Connected");
      resolve({ db });
    });
  });
};

module.exports.closeMongoConnection = (mongooseInst = mongoose) =>
  mongooseInst.disconnect();

module.exports.mongooseInstance = mongooseInstance;
