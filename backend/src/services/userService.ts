import UserModel, { IUser } from '../models/UserModel';
import User from '../types/User';

export const createUser =async (user:User): Promise<IUser>=> {
  try {
    const { name, email, password } = user;
    const newUser = new UserModel({
      name,
      email,
      password,
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

