import UserModel, { IUser } from '@models/User';
import logger from '@utils/logger';
import { Request } from 'express';
import { getUserByIdentifier } from './user.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose, { Document, Types } from 'mongoose';
import getRandomNumber from '@utils/getRandomNumber';
import { errorMessages } from '@utils/constants';

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
    logger.info('Tokens generated successfully');
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (err) {
    logger.error('Error generating tokens: ', err);
    throw new Error(errorMessages.TOKENS_NOT_GENERATED);
  }
};

export const getUserTokens = async (
  user:
    | Document<unknown, {}, IUser> &
        IUser & {
          _id: mongoose.Types.ObjectId;
        }
) => {
  const tokens = await generateToken(user);
  if (tokens == null) {
    logger.error('Error generating tokens');
    throw new Error(errorMessages.TOKENS_NOT_GENERATED);
  }
  return tokens;
};

export const extractToken = (req: Request) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token;
};
