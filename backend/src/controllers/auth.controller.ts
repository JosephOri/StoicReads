import { Request, Response } from 'express';
import {
  createUser,
  getUserByIdentifier,
  validatePassword,
  getUserById,
} from '../services/user.service';
import { googleLoginService } from '../services/auth.service';
import { getUserTokens, extractToken } from '../services/auth.service';
import User from '../interfaces/User';
import { HttpStatusCode } from 'axios';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { errorMessages } from '../utils/constants';
import { OAuth2Client } from 'google-auth-library';

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      logger.error('Required fields werent provided.');
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: 'Please provide all required fields' });
    }
    const user: User = { userName, email, password };
    const newUser = await createUser(user);
    res.status(HttpStatusCode.Created).json(newUser);
  } catch (error: any) {
    logger.error('Error creating user: ', error.message);
    if (error.message.includes('duplicate key error')) {
      return res
        .status(HttpStatusCode.Conflict)
        .json({ message: 'User already exists' });
    }
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const userIdentifier = req.body.userName || req.body.email;
    const password = req.body.password;
    if (!userIdentifier || !password) {
      logger.error('All fields are required');
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: errorMessages.INVALID_CREDENTIALS });
    }
    const user = await getUserByIdentifier(userIdentifier);
    if (!user) {
      logger.error('User not found');
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: errorMessages.USER_NOT_FOUND });
    }
    const isUserPasswordMatch = await validatePassword(password, user.password);
    if (!isUserPasswordMatch) {
      logger.error('Password is incorrect');
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: errorMessages.USER_NOT_FOUND });
    }
    const tokens = await getUserTokens(user);
    logger.info('User logged in successfully');
    res.status(HttpStatusCode.Ok).json(tokens);
  } catch (error: any) {
    logger.error('Error logging in: ', error.message);
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

export const logout = async (req: Request, res: Response) => {
  const refreshToken = extractToken(req);
  if (!refreshToken) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: errorMessages.INVALID_TOKEN });
  }

  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET as string,
    async (err: any, user: any) => {
      if (err) {
        return res
          .status(HttpStatusCode.Unauthorized)
          .json({ message: errorMessages.INVALID_TOKEN });
      }
      try {
        const userDb = await getUserById(user._id);
        if (!userDb?.tokens || !userDb.tokens.includes(refreshToken)) {
          return res
            .status(HttpStatusCode.Unauthorized)
            .json({ message: errorMessages.NOT_FOUND_USER_ID });
        }
        userDb.tokens = userDb.tokens.filter((token) => token !== refreshToken);
        await userDb.save();
        return res
          .status(HttpStatusCode.Ok)
          .json({ message: 'User logged out successfully' });
      } catch (error: any) {
        logger.error('Error logging out: ', error.message);
        return res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: error.message });
      }
    }
  );
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const tokens = await googleLoginService(req, res);
    logger.info('User logged in successfully');
    res.status(HttpStatusCode.Ok).json(tokens);
  } catch (error: any) {
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
