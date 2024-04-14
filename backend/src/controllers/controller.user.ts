import { Request, Response } from 'express';
import { createUser } from '@services/service.user';

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, email, password } = req.body;
    const user = { userName, email, password };
    const newUser = await createUser(user);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
