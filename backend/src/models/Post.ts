import mongoose, { Schema, Document } from 'mongoose';
import Book  from '../interfaces/Book';
import  Review  from '../interfaces/Review';
import  Comment from '../interfaces/Comment';

export interface IPost extends Document {
  userName: string;
  book: Book;
  title: string;
  comments: Comment[];
  review: Review;
  image?: string;
  imageFile?: File | null;
}

const PostSchema: Schema = new Schema({
  userName: { type: String, required: true },
  book: { type: Object, required: true },
  title: { type: String, required: true },
  comments: [{ type: Object, required: true }],
  review: { type: Object, required: true },
  image: { type: String }, // New field for storing image path
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;
