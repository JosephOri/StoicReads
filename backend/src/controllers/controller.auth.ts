import { Request, Response } from 'express';
import { createUser } from '../services/service.user';
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
