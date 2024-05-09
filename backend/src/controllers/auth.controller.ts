import { Request, Response } from 'express';
import {
  createUser,
  getUser,
  validatePassword,
} from '../services/user.service';
import { getUserTokens, extractToken } from '../services/auth.service';
import User from '../interfaces/User';
import { HttpStatusCode } from 'axios';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { errorMessages } from 'src/constants/constants';

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
    const user = await getUser(userIdentifier);
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
