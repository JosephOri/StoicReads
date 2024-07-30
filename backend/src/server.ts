import express, { Express } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import logger from "@utils/logger";
import applicationRouter from "@routes/application.router";
import connectToDatabase from "@utils/dbConfig";
import cors from "cors";
import path from "path";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { handleSocket } from "./socketHandler"; 

const app: Express = express();

app.use(
  cors({
    origin: "*", // http://localhost:5173
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(applicationRouter);
console.log("dirname: " + __dirname);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

connectToDatabase()
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      logger.info(`Server is running on port ${process.env.PORT}`);
    });
    handleSocket(io);
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });
