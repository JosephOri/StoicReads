import mongoose from 'mongoose';

export interface Review {
    _id: mongoose.Types.ObjectId;
    description: string;
    rating: number;
}  