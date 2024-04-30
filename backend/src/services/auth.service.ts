import UserModel, { IUser } from '@models/User';
import { Request } from 'express';
import { getUser } from './user.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose, { Document } from 'mongoose';
import getRandomNumber from '@utils/getRandomNumber';

export const generateToken = async (
  user: Document<unknown, {}, IUser> &
    IUser & {
      _id: mongoose.Types.ObjectId;
    }
) => {
  const accessToken = jwt.sign(
    { _id: user._id },
    process.env.TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION as string,
    }
  );
  const random = getRandomNumber(1, 1000000000);
  const refreshToken = jwt.sign(
    { _id: user._id, random: random },
    process.env.TOKEN_SECRET as string,
    {}
  );
  if (user.tokens == null) {
    user.tokens = [];
  }
  user.tokens.push(refreshToken);
  try {
    await user.save();
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err) {
    return null;
  }
};

export const getUserTokens = async (
  userIdentifier: string,
  password: string
) => {
  const user = await getUser(userIdentifier);
  if (!user) {
    throw new Error('invalid credentials');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  const tokens = await generateToken(user);
  if (tokens == null) {
    throw new Error('Error generating tokens');
  }
  return tokens;
};

export const extractToken = (req: Request) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token;
};
