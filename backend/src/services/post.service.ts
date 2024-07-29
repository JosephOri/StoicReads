import PostModel, { IPost } from '../models/Post';
import path from 'path';

interface CreatePostParams {
  userName: string;
  book: {
    title: string;
    authors: string;
    image: string;
  };
  title: string;
  content: string;
  rating: number;
  description: string;
  image?: string;
}

export async function getAllPosts(): Promise<IPost[]> {
  const posts = await PostModel.find().exec();
  return posts;
}

export async function getPostById(postId: string): Promise<IPost | null> {
  const post = await PostModel.findById(postId).exec();
  return post;
}

export async function getPostsByUser(userName: string): Promise<IPost[]> {
  const posts = await PostModel.find({ userName }).exec();
  return posts;
}


export async function createPost(postData: CreatePostParams): Promise<IPost> {
  try {
    const newPost = new PostModel({
      userName: postData.userName,
      book: postData.book,
      title: postData.title,
      content: postData.content,
      comments: [],
      review: {
        rating: postData.rating,
        description: postData.description,
      },
      image: postData.image,
    });

    return await newPost.save();
  } catch (err) {
    console.log('err', err);
    throw new Error('Error creating post ' + err);
  }
}

export async function updatePost(
  postId: string,
  updatedPost: IPost
): Promise<IPost | null> {
  const updated = await PostModel.findByIdAndUpdate(postId, updatedPost, {
    new: true,
  }).exec();
  return updated;
}

export async function deletePost(postId: string): Promise<boolean> {
  const result = await PostModel.findByIdAndDelete(postId).exec();
  return !!result;
}
