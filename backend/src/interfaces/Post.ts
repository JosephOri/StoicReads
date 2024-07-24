import { Book } from "./Book";
import { Review } from "./Review";

export interface Post {
    userName: string;
    book: Book;
    title: string;
    content: string;
    comments: Comment[];
    review: Review;
    image?: string;
}