import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    userName: string; 
}

const PostSchema: Schema = new Schema({
    userName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const PostModel = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;