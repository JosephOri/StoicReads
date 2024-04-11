import express, { Express, Request, Response } from "express";
const app: Express = express();
import Logger from "./utils/logger";

import env from 'dotenv';
env.config();

import mongoose from "mongoose";
import bodyParser from "body-parser";

const db = mongoose.connection;
db.on("error", (error)=> console.error(error));
db.once("open", ()=> console.log("Connected to Database"));
mongoose.connect(process.env.DB_URL as string);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

app.listen(process.env.PORT, () => {
  Logger.info(`Server is running on port ${process.env.PORT}`);
});