import mongoose from 'mongoose';

export const connectToDB = async (): Promise<void> => {
  mongoose.connect(process.env.MONGODB_URI as string);
};
