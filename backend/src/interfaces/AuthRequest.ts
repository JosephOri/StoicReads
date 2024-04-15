import { Request } from 'express';
import mongoose from 'mongoose';

export type AuthRequest = Request & { user: { _id: mongoose.Types.ObjectId } };
