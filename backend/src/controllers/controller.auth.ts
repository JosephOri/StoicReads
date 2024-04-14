import { Request, Response } from 'express';
import { createUser } from '@services/service.user';
import { getUserTokens } from '@services/service.auth';
import User from '../types/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide all required fields' });
    }
    const user: User = { userName, email, password };
    const newUser = await createUser(user);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const userIdentifier = req.body.userName || req.body.email;
    const password = req.body.password;
    if (!userIdentifier || !password) {
      return res.status(400).send('All fields are required');
    }
    const tokens = await getUserTokens(userIdentifier, password);
    res.status(200).json(tokens);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
export const extractToken = (req: Request): string | undefined => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token;
};
