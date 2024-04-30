import authRouter from './auth.route';
import express from 'express';

const applicationRouter = express.Router();

applicationRouter.use('/auth', authRouter);

export default applicationRouter;
