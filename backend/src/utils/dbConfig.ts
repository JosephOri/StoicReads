import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectToDatabase = async (): Promise<void> => {
  try {
    const dbUri = process.env.NODE_ENV = "production" ? process.env.MONGODB_URI_PROD: process.env.MONGODB_URI
    await mongoose.connect(dbUri as string);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error}`);
    throw error;
  }
};

export default connectToDatabase;
