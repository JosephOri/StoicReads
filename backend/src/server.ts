import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import logger from "@utils/logger";
import applicationRouter from "@routes/application.router";
import connectToDatabase from "@utils/dbConfig";
import cors from "cors";

const app: Express = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(applicationRouter);

connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info("Server is running");
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });
