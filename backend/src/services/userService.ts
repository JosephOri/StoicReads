import UserModel, { IUser } from '../models/User';
import bcrypt from 'bcrypt';
import User from '../types/User';

export const createUser =async (user:User): Promise<IUser>=> {
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
}

export const getUserByEmail = async(email: string): Promise<IUser | null> => {
  try {
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error) {
    throw new Error(`Error getting user by email: ${error}`);
  }
}

export const getUserByUserName = async(userName: string): Promise<IUser | null> => {
  try {
    const user = await UserModel.findOne({userName});
    return user;
  } catch (error) {
    throw new Error(`Error getting user by username: ${error}`);
  }
}

export const deleteUserByEmail = async(email: string): Promise<IUser | null> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({ email });
    return deletedUser;
  }catch (error) {
    throw new Error(`Error deleting user by email: ${error}`);
  }
}

export const deleteUserByUserName = async(userName: string): Promise<IUser | null> => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({ userName });
    return deletedUser;
  } catch (error) {
    throw new Error(`Error deleting user by username: ${error}`);
  }
}





