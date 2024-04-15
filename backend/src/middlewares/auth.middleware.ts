import { Request, Response, NextFunction } from 'express';
import AuthRequest from '@interfaces/AuthRequest';
import jwt from 'jsonwebtoken';
import { extractToken } from '@services/auth.service';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET as string);
    if (!verified) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.body.user._id = verified;
    return next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};
