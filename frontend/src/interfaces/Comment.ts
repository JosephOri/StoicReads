import mongoose from "mongoose";

export interface Comment {
    _id: mongoose.Types.ObjectId;
    userName: string;
    content: string;
    createdAt?: Date;
  }
  