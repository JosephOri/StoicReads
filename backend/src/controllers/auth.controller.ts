import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { googleLoginService } from '../services/auth.service';
import { getUserTokens, extractToken } from '../services/auth.service';
import User from '../interfaces/User';
import { HttpStatusCode } from 'axios';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { errorMessages } from '../utils/constants';
import { OAuth2Client } from 'google-auth-library';
import { log } from 'console';

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, email, password, profileImage } = req.body;
    if (!userName || !email || !password || !profileImage) {
      logger.error('Required fields werent provided.');
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: 'Please provide all required fields' });
    }
    const imagePath = req.file ? `/uploads/${req.file.filename}` : profileImage;
    const user: User = { userName, email, password, profileImage: imagePath };
    const newUser = await userService.createUser(user);
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
    const user = await userService.getUserByIdentifier(userIdentifier);
    if (!user) {
      logger.error('User not found');
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: errorMessages.USER_NOT_FOUND });
    }
    const isUserPasswordMatch = await userService.validatePassword(
      password,
      user.password
    );
    if (!isUserPasswordMatch) {
      logger.error('Password is incorrect');
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ message: errorMessages.USER_NOT_FOUND });
    }
    const tokens = await getUserTokens(user);
    logger.info('User logged in successfully');
    res.status(HttpStatusCode.Ok).json({ user, tokens });
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
        const userDb = await userService.getUserById(user._id);
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
    const user = await googleLoginService(req, res);
    logger.info('User logged in successfully');
    res.status(HttpStatusCode.Ok).json(user);
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

export const getUser = async (req: Request, res: Response) => {
  const accessToken = extractToken(req);
  if (!accessToken) {
    return res
      .status(HttpStatusCode.Unauthorized)
      .json({ message: errorMessages.INVALID_TOKEN });
  }
  jwt.verify(
    accessToken,
    process.env.TOKEN_SECRET as string,
    async (err: any, user: any) => {
      if (err) {
        return res
          .status(HttpStatusCode.Unauthorized)
          .json({ message: errorMessages.INVALID_TOKEN });
      }
      try {
        const userDb = await userService.getUserById(user._id);
        if (!userDb) {
          return res
            .status(HttpStatusCode.NotFound)
            .json({ message: errorMessages.NOT_FOUND_USER_ID });
        }
        return res.status(HttpStatusCode.Ok).json(userDb);
      } catch (error: any) {
        logger.error('Error getting user: ', error.message);
        return res
          .status(HttpStatusCode.InternalServerError)
          .json({ message: error.message });
      }
    }
  );
};

export const updateUser = async (req: Request, res: Response) => {
  const userid = req.params.userId;
  const updatedUserData = req.body;
  console.log('updated user data:', updatedUserData);
  const imagePath = req.file
    ? `/uploads/${req.file.filename}`
    : updatedUserData.profileImage;
  console.log('image path:', imagePath);
  try {
    const { userName, email, password, profileImage } = updatedUserData;
    if (!userName || !email || !password || !profileImage) {
      logger.error('Required fields werent provided.');
      return res
        .status(HttpStatusCode.BadRequest)
        .json({ message: 'Please provide all required fields' });
    }

    const newUser = await userService.updateUser(userid, {
      userName,
      email,
      password,
      profileImage: imagePath,
    });
    res.status(HttpStatusCode.Created).json(newUser);
  } catch (error: any) {
    console.log(error.message);
    console.log(error);
    logger.error('Error updating user: ', error.message);
    if (error.message.includes('duplicate key error')) {
      logger.error('Username already in use');
      return res
        .status(HttpStatusCode.Conflict)
        .json({ message: 'Username already in use' });
    }
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await userService.deleteUser(userId);
    if (!user) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ message: 'User not found' });
    }
    return res
      .status(HttpStatusCode.Ok)
      .json({ message: 'User deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting user: ', error.message);
    return res
      .status(HttpStatusCode.InternalServerError)
      .json({ message: error.message });
  }
};
