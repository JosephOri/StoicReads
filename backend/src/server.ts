import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import logger from '@utils/logger';
import applicationRouter from '@routes/application.router';
import { connectToDB } from '@utils/dbConfig';

const app: Express = express();
app.use(bodyParser.json());
app.use(applicationRouter);

connectToDB()
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      logger.info('Server is running');
    });
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });
