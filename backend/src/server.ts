import express, { Express } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import logger from "@utils/logger";
import applicationRouter from "@routes/application.router";
import connectToDatabase from "@utils/dbConfig";
import cors from "cors";
import path from "path";
import { handleSocket } from "./socketHandler";
import { createServer } from "http";
const { Server } = require("socket.io");

const app: Express = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(applicationRouter);
console.log("dirname: " + __dirname);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(`Server is running in port ${process.env.PORT}`);
      handleSocket(io);
    });
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });
