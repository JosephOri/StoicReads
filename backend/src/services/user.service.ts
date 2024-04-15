import UserModel, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import User from '../interfaces/User';

export const createUser = async (user: User): Promise<IUser> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = new UserModel({
      userName: user.userName,
      email: user.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

export const getUserByEmailOrUserName = async (identifier: string) => {
  try {
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });
    return user;
  } catch (error) {
    throw new Error(`Error getting user by email or username: ${error}`);
  }
};

export const deleteUserByEmailOrUserName = async (
  identifier: string
): Promise<IUser | null> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({
      $or: [{ email: identifier }, { userName: identifier }],
    });
    return deletedUser;
  } catch (error) {
    throw new Error(`Error deleting user by email or username: ${error}`);
  }
};

//TODO : Add update profile picture function
