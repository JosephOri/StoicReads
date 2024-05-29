import UserModel, { IUser } from '@models/User';
import User from '../interfaces/User';
import logger from '@utils/logger';
import { Request, Response } from 'express';
import { createUser ,getUserByIdentifier } from './user.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { HttpStatusCode } from 'axios';
import { errorMessages } from '@utils/constants';
import mongoose, { Document, Types } from 'mongoose';
import getRandomNumber from '@utils/getRandomNumber';
import { OAuth2Client } from 'google-auth-library';

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

export const googleLoginService = async (req: Request, res: Response) => {
  const googleOAuthClient = new OAuth2Client();
  try{
    const authTicket = await googleOAuthClient.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
  });
  const payload = authTicket.getPayload();
  const email = payload?.email;

  if (!email) {
    logger.error('Email not found in payload');
    return res
      .status(HttpStatusCode.InternalServerError)
      .json({ message: 'Email not found in payload' });
  }

  let user = await getUserByIdentifier(email);
  const randPassword = getRandomNumber(1, 1000000000).toString();
  if (!user) {
    const newUser: User = {
      userName: payload?.name || '',
      email: email,
      password: randPassword,
      profilePicture: payload?.picture,
    };
    logger.info(`You've been given a random password, Please change it after logging in.`);
    
    user = await createUser(newUser);
  }

  const tokens = await getUserTokens(user);
  logger.info('User logged in successfully');
  res.status(HttpStatusCode.Ok).json(tokens);
  
  } catch(error: any) {
  logger.error('Error logging in witn Google: ', error.message);
  if (error.message === errorMessages.INVALID_CREDENTIALS) {
    logger.error('User not found or password is incorrect');
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: errorMessages.USER_NOT_FOUND });
  }
  res
    .status(HttpStatusCode.InternalServerError)
    .json({ message: error.message });
  }
};