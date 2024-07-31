import mongoose from 'mongoose';
import {
        getPostById, 
        getPostsByUserName, 
        createPost, 
        updatePost,
        deletePost,
       } from '../../services/post.service';
import PostModel, { IPost } from '../../models/Post';

import 'dotenv/config';
import connectToDatabase from '../../utils/dbConfig';
import { errorMessages } from '@utils/constants';

interface TestPost { 
    userName: string;
    book: {
        title: string;
        authors: string;
        image: string;
    };
    title: string;
    rating: number;
    description: string;
    image?: string;
}   

const testPost: TestPost = {
    userName: 'JohnDoe',
    book: {
        title: 'Book Title',
        authors: 'Book Authors',
        image: 'Book Image',
    },
    title: 'Post Title',
    rating: 5,
    description: 'Post Description',
    image: 'Post Image',
} as const;

const assertPost = (newPost: IPost | null, expectedPost: TestPost) => {
    expect(newPost).toBeDefined();
    expect(newPost).toHaveProperty('_id', expect.any(mongoose.Types.ObjectId));
    expect(newPost).toHaveProperty('userName', expectedPost.userName);
    expect(newPost).toHaveProperty('book', expectedPost.book);
    expect(newPost).toHaveProperty('title', expectedPost.title);
    expect(newPost).toHaveProperty('review.rating', expectedPost.rating);
    expect(newPost).toHaveProperty('review.description', expectedPost.description);
    expect(newPost).toHaveProperty('image', expectedPost.image);
};

describe('Post Service', () => {
    beforeAll(async () => {
        await connectToDatabase();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await PostModel.deleteMany({userName: testPost.userName});
    });

    describe('Create Post (C)', () => {
        it('should create a new post', async () => {
            const newPost = await createPost(testPost);
            assertPost(newPost, testPost);
        });

        it('should throw an error if post already exists', async () => {
            await createPost(testPost);
            await expect(createPost(testPost)).rejects.toThrow(errorMessages.POST_ALREADY_EXISTS);
        });

        it('should throw an error if post data is invalid', async () => {
            const invalidPost = {
                userName: '',
                book: {
                    title: '',
                    authors: '',
                    image: '',
                },
                title: '',
                description: '',
                rating: 0,
                image: '',
            };
            await expect(createPost(invalidPost)).rejects.toThrow(errorMessages.INVALID_FORM_DATA);
        });
    });

    describe('Read Post (R)', () => {
        it('should get post by id', async () => {
            const newPost = await createPost(testPost);
            const post = await getPostById(newPost._id as string);
            assertPost(post, testPost);
        });

        it('should get post by username', async () => {
            const newPost = await createPost(testPost);
            const posts = await getPostsByUserName(newPost.userName);
            expect(posts).toHaveLength(1);
            assertPost(posts[0], testPost);
        });
    });

    describe('Update Post (U)', () => {
        it('should update post by id', async () => {
            const newPost = await createPost(testPost);
            const updatedPostData = { ...newPost.toObject(), title: 'Updated Post Title' };
            const updatedPost = await updatePost(newPost._id as string, updatedPostData);
            expect(updatedPost).toHaveProperty('title', 'Updated Post Title');
        });
    });

    describe('Delete Post (D)', () => {
        it('should delete post by id', async () => {
            const newPost = await createPost(testPost);
            const deletedPost = await deletePost(newPost._id as string);
            expect(deletedPost).toBe(true);
        });

        it('should throw an error if post is not found', async () => {
            const postId = 'nonexistent';
            await expect(deletePost(postId)).rejects.toThrow(errorMessages.FAILED_TO_DELETE_POST);
        });
    });
});