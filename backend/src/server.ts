import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import Logger from '@utils/logger';
import authRouter from '@routes/route.auth';
import mongoose, { mongo } from 'mongoose';

const app: Express = express();
app.use(bodyParser.json());
app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express!');
});
app.get('/adsasd', (req: Request, res: Response) => {
  res.send('my router!');
});

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    Logger.info('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      Logger.info('Server is running');
    });
  })
  .catch((error) => {
    Logger.error(`Error connecting to MongoDB: ${error}`);
  });
