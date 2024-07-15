import mongoose from 'mongoose';
export interface User {
  email: string;
  password: string;
  profilePicture?: string;
  userName: string;
  _id?: mongoose.Types.ObjectId;
  accessToken?: string;
  refreshToken?: string;
}
