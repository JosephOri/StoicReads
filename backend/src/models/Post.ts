import mongoose, { Schema, Document } from "mongoose";
import { Book } from "../interfaces/Book";
import { Review } from "../interfaces/Review";
import { Comment as UserComment } from "../interfaces/Comment";

export interface Post extends Document {
  username: string;
  book: Book;
  title: string;
  content: string;
  comments: UserComment[];
  review: Review;
}
const PostSchema: Schema = new Schema({
  username: { type: String, required: true },
  book: { type: Object, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [{ type: Object, required: true }],
  review: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const PostModel = mongoose.model<Post>("Post", PostSchema);

export default PostModel;
