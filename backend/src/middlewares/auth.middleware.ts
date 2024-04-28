import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { extractToken } from '@services/auth.service';
import logger from '../utils/logger';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string);
    if (!decodedToken || typeof decodedToken !== 'string') {
      throw new Error('Invalid token');
    }
    req.body.user._id = decodedToken;
    return next();
  } catch (error) {
    logger.error({ error }, 'Authentication error');
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
