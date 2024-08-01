import Book from './Book';
import Review from './Review';
import Comment from './Comment';

interface Post {
    userName: string;
    book: Book;
    title: string;
    comments: Comment[];
    review: Review;
    image?: string;
}

export default Post;