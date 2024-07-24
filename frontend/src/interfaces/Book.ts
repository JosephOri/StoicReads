import mongoose from "mongoose";

export interface Book {
    _id: mongoose.Types.ObjectId;
    title: string;
    authors: string;
    image: string;
  }
  