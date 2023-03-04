import express from "express";
import mongoose from "mongoose";
import config from "config";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { createTerminus } from "@godaddy/terminus";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import S3Service from "./api/middlewares/aws/s3/multer.js";
// import createMigrationAndRunMigrations from "./api/model/migrations/index.js"

import loginRoutes from "./api/routes/auth/login.js";
import userRoutes from "./api/routes/user/index.js";
import dogRoutes from "./api/routes/dog/index.js";
import imagesRoutes from "./api/routes/images/index.js";
import swaggerOptions from "./api/docs/swagger-definitions/index.js";

dotenv.config();

const app = express();

const env = config.get("env_name");
const port = config.get("server.port");
const MONGODB_URI = config.get("db.uri");

const startServer = async () => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port: ${port}`);
  });

  // bucket exist

  switch (env) {
    case "dev":
      mongoose
        .connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(() => {
          console.log("dev db connected");
        });
      break;
    case "staging":
      mongoose.set("strictQuery", false);
      mongoose.connect(MONGODB_URI).then(() => {
        console.log("staging db connected");
      });
      break;
    case "production":
      mongoose.set("strictQuery", false);
      mongoose.connect(MONGODB_URI).then(() => {
        console.log("prodcution db connected");
      });
      break;
  }

  const s3Service = new S3Service();
  s3Service.client;

  // Call script to create migration file and run migrations
  // createMigrationAndRunMigrations()

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
      await closeConnection();
    },
    onSignal: async () => {
      await closeConnection();
    },
    onShutdown: async () => {
      await closeConnection();
    },

    // both
    // logger: console.log(),
  };

  function healthCheck() {
    return Promise.resolve("Service is healthy!");
  }

  async function closeConnection() {
    // Perform some asynchronous task here, such as closing a database connection
    await mongoose.connection.close();
  }

  createTerminus(server, options);
};

const endServer = async (signal) => {
  console.log(`${signal} received. Shutting down...`);

  // Clear database
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();

  // Clear S3
  if (env === "dev" || env === "staging") {
    console.log(
      `Deleting ${objects.Contents.length} objects from S3 bucket ${S3_BUCKET_NAME}...`
    );
    const s3Service = new S3Service();
    s3Service.deleteAllObjects;

    console.log("Server shutting down.");
    process.exit(0);
  }
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
app.use("/login", loginRoutes);
app.use("/dog", dogRoutes);
app.use("/images", imagesRoutes);

process.on("SIGINT", () => {
  endServer("SIGINT");
});

process.on("SIGTERM", () => {
  endServer("SIGTERM");
});

startServer();
export default app;
