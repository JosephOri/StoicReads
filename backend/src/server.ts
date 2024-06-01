import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import logger from '@utils/logger';
import applicationRouter from '@routes/application.router';
import connectToDatabase from '@utils/dbConfig';
import cors from 'cors';

const app: Express = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(applicationRouter);

connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info('Server is running');
    });
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });
