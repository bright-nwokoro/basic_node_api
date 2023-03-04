import mongoose from "mongoose";
import User from "../api/model/user/index.js";

const dbURI = "mongodb://admin:password@mongo:27017";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database.");
    return User.deleteMany({});
  })
  .then((result) => {
    console.log(`Deleted ${result.deletedCount} users.`);
    return mongoose.disconnect();
  })
  .then(() => {
    console.log("Disconnected from database.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
