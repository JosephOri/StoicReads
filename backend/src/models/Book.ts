import mongoose, { Schema, Document } from "mongoose";

export interface Book extends Document {
  title: string;
  authors: string;
  image: string;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  authors: { type: String, required: true },
  image: { type: String, required: true },
});

const BookModel = mongoose.model<Book>("Book", BookSchema);

export default BookModel;
