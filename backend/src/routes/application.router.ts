import authRouter from "./auth.route";
import postRouter from "./post.route";
import express from "express";

const applicationRouter = express.Router();

applicationRouter.use("/auth", authRouter);
applicationRouter.use("/post", postRouter);
export default applicationRouter;
