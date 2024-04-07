import UserModel, { IUser } from '../models/User';
import User from '../types/User';

export const createUser =async (user:User): Promise<IUser>=> {
  try {
    const newUser = new UserModel(user);
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



