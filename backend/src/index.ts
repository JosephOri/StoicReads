import express, { Express, Request, Response } from "express";
import Logger from "./utils/logger";

import env from 'dotenv';
env.config();

import mongoose from "mongoose";
import bodyParser from "body-parser";

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

const db = mongoose.connection;
db.on("error", (error)=> console.error(error));
db.once("open", ()=> console.log("Connected to Database"));
mongoose.connect(process.env.DB_URL as string)
  .then(() => {
    Logger.info("Connected to Database");
    app.listen(process.env.PORT, () => {
      Logger.info(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    Logger.error(`Error connecting to MongoDB: ${error}`);
  });