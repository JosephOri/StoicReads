import express, { Express, Request, Response } from "express";
import Logger from "@utils/logger";

const app: Express = express();
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express!");
});

app.listen(PORT, () => {
  Logger.info("Server is running");
});
