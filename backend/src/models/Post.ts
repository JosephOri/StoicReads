import mongoose, { Schema, Document } from "mongoose";
import { Book } from "./Book";

interface Post extends Document {
  user: mongoose.Types.ObjectId;
  book: Book;
  title: string;
  content: string;
  comments: Array<mongoose.Types.ObjectId>;
  reviews: Array<mongoose.Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  book: { type: mongoose.Types.ObjectId, ref: "Book", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PostModel = mongoose.model<Post>("Post", PostSchema);

export default PostModel;
