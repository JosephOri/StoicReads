import express, { Express } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import logger from '@utils/logger';
import applicationRouter from '@routes/application.router';
import connectToDatabase from '@utils/dbConfig';
import cors from 'cors';
import path from 'path';

const app: Express = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(applicationRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
<<<<<<< HEAD
      logger.info("Server is running");
      console.log(`Server is running on port ${process.env.PORT}`);
=======
      logger.info('Server is running');
>>>>>>> master
    });
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });
