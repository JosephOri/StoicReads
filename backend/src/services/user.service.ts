import UserModel, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import User from '@interfaces/User';
import logger from '../utils/logger';
export const createUser = async (user: User): Promise<IUser> => {
  try {
    const salt = await bcrypt.genSalt(
      parseInt(process.env.SALT_ROUNDS as string)
    );
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = new UserModel({
      userName: user.userName,
      email: user.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    throw new Error(`failed to create user`);
  }
};

export const getUser = async (identifier: string) => {
  try {
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });
    return user;
  } catch (error: any) {
    logger.error(`Error getting user by identifier: ${error.message}`);
    throw new Error(`failed to get user`);
  }
};

export const deleteUser = async (identifier: string): Promise<IUser | null> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({
      $or: [{ email: identifier }, { userName: identifier }],
    });
    logger.info(`Deleted user: ${deletedUser}`);
    return deletedUser;
  } catch (error) {
    logger.error(`Error deleting user by email or username: ${error}`);
    throw new Error(`Error deleting user by email or username: ${error}`);
  }
};

//TODO : Add update profile picture function
