import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

const isEmail = validator.isEmail;

export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
        validate: [isEmail, 'Invalid email'],
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;