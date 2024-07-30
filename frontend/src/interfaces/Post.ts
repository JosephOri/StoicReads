import mongoose from "mongoose";
import { Book } from "./Book";
import { Review } from "./Review";

export interface Post {
    _id: mongoose.Types.ObjectId;
    userName: string;
    book: Book;
    title: string;
    content: string;
    comments: Comment[];
    review: Review;
    image?: string;
    createdAt: string;
    updatedAt: string;
}