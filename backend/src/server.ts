import express, { Express } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import logger from "./utils/logger";
import applicationRouter from "./routes/application.router";
import connectToDatabase from "./utils/dbConfig";
import cors from "cors";
import path from "path";
import http from "http";
import https from "https";
import fs from "fs";
import { Server as SocketIOServer } from "socket.io";
import { handleSocket } from "./socketHandler"; 
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";


const app: Express = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StoicReads",
      version: "1.0.1",
      description:
        "REST server including authentication using JWT and refresh token",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://node07.cs.colman.ac.il"
            : "https://10.10.248.167",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(applicationRouter);
console.log("dirname: " + __dirname);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let port;
let httpServer;

if (process.env.NODE_ENV !== "production") {
  console.log("development");
  port = process.env.PORT || 4000;
  httpServer = http.createServer(app).listen(port);
} else {
  console.log("production");
  port = process.env.HTTPS_PORT;
  const options2 = {
    key: fs.readFileSync("../../client-key.pem"),
    cert: fs.readFileSync("../../client-cert.pem"),
  };
  httpServer = https.createServer(options2, app).listen(port);
}
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
connectToDatabase()
  .then(() => {
    logger.info(`Server is running on port ${port}`);
    handleSocket(io);
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });
