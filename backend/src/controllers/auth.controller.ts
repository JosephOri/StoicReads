import { Request, Response } from 'express';
import { createUser } from '../services/user.service';
import { getUserTokens, extractToken } from '../services/auth.service';
import User from '../interfaces/User';
import jwt from 'jsonwebtoken';

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
      return res.status(400).json({ message: 'All fields are required' });
    }
    const tokens = await getUserTokens(userIdentifier, password);
    res.status(200).json(tokens);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
