import authRouter from './auth.route';
import postRouter from './post.route';
import messageRouter from './message.route';
import express from 'express';

const applicationRouter = express.Router();

applicationRouter.use('/auth', authRouter);
applicationRouter.use('/post', postRouter);
applicationRouter.use('/message', messageRouter);

export default applicationRouter;
