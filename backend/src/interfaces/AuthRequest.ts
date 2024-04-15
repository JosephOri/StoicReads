import { Request } from 'express';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user: {
    _id: mongoose.Types.ObjectId;
  };
}

export default AuthRequest;
