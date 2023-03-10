import express from "express";
import mongoose from "mongoose";
import config from "config";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { createTerminus } from "@godaddy/terminus";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import migrateMongo from "migrate-mongo";
const { runMigrations } = migrateMongo;

import S3MulterService from "./api/middlewares/multer.js";
import S3Service from "./api/utils/s3/index.js";

// import createMigrationAndRunMigrations from "./api/model/migrations/index.js"

// import loginRoutes from "./api/routes/auth/login.js";
import userRoutes from "./api/routes/user/index.js";
import dogRoutes from "./api/routes/dog/index.js";
import imagesRoutes from "./api/routes/images/index.js";

import swaggerOptions from "./api/docs/swagger-definitions/index.js";

dotenv.config();

const app = express();

const env = config.get("env_name");
const port = config.get("server.port");
const dbConfig = config.get("db");

const MONGODB_URI = dbConfig.uri;

const startServer = async () => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port: ${port}`);
  });

  async function up(db) {
    await db.collection("users").updateMany({}, { $set: { username: "" } });
  }

  // Define the "down" migration function to remove the "username" field from the "users" collection
  async function down(db) {
    await db.collection("users").updateMany({}, { $unset: { username: "" } });
  }

  // bucket exist

  switch (env) {
    case "dev":
      mongoose
        .connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(async () => {
          console.log("dev db connected");

          if (dbConfig.migrate_on_start) {
            await up(mongoose.connection.db);
            console.log("Dev Migration complete");
          }
        });
      break;
    case "staging":
      mongoose.set("strictQuery", false);
      mongoose.connect(MONGODB_URI).then(async () => {
        console.log("staging db connected");

        if (dbConfig.migrate_on_start) {
          await up(mongoose.connection.db);
          console.log("Staging Migration complete");
        }
      });
      break;
    case "production":
      mongoose.set("strictQuery", false);
      mongoose.connect(MONGODB_URI).then(async () => {
        console.log("prodcution db connected");

        if (dbConfig.migrate_on_start) {
          await up(mongoose.connection.db);
          console.log("Production Migration complete");
        }
      });
      break;
  }

  const s3Service = new S3Service();
  s3Service
    .isS3BucketNameExist()
    .then((result) => {
      switch (result) {
        case "error":
          console.log("Unable to create S3 Bucket");
          break;
        case "yes":
          console.log("Bucket already exists. Skipping...");
          break;
        case "does not exist":
          s3Service.createS3Bucket();
          break;
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
    });

  const options = {
    // health check options
    healthChecks: {
      "/healthcheck": healthCheck,
      verbatim: true,
      __unsafeExposeStackTraces: true,
    },
    caseInsensitive: true,
    statusOk: 200,
    statusError: 503,

    // cleanup options
    timeout: 1000,
    signal: "SIGTERM",
    signals: [],
    useExit0: false,
    sendFailuresDuringShutdown: true,
    beforeShutdown: async () => {
      await endServer();
    },
    onSignal: async () => {
      await endServer();
    },
    onShutdown: async () => {
      await endServer();
    },

    // both
    // logger: console.log(),
  };

  function healthCheck() {
    const mongooseStatus =
      mongoose.connection.readyState === 1 ? "ready" : "not ready";

    const s3Status = s3Service.checkS3Connection();
    if (mongooseStatus === "not ready" || s3Status === "not ready") {
      // throw new Error("Some dependencies are not ready");

      return Promise.resolve("Some dependencies are not ready");
    }

    return Promise.resolve("Service is healthy!");
  }

  createTerminus(server, options);
};

const endServer = async () => {
  if (dbConfig.clear_db_on_close) {
    await mongoose.connection.db.dropDatabase();
  }

  await mongoose.connection.close();

  if (dbConfig.clear_bucket_on_close) {
    console.log(`Deleting objects from S3 bucket ${S3_BUCKET_NAME}...`);

    const s3Service = new S3MulterService();
    s3Service.deleteAllObjects;
  }

  console.log("Server shutting down.");
  process.exit(0);
};

app.use(bodyParser.json({ limit: "2mb" }));
app.use(
  cors({
    origin: "*",
  })
);

const specs = swaggerJsdoc(swaggerOptions);

app.use("/docs/:id", swaggerUi.serve, (req, res) => {
  let html = null;

  const id = req.params.id;

  if (id === "user") {
    html = swaggerUi.generateHTML(specs);
  }

  if (html !== null) {
    return res.status(200).send(html);
  }
});

app.use("/user", userRoutes);
app.use("/dog", dogRoutes);
// app.use("/login", loginRoutes);
app.use("/images", imagesRoutes);

process.on("SIGINT", () => {
  endServer();
});

process.on("SIGTERM", () => {
  endServer();
});

startServer();
export default app;
