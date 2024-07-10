import PostModel, { Post } from "../models/Post";

export async function getAllPosts(): Promise<Post[]> {
  const posts = await PostModel.find().exec();
  return posts;
}

export async function getPostById(postId: string): Promise<Post | null> {
  const post = await PostModel.findById(postId).exec();
  return post;
}

export async function createPost(post: Post): Promise<Post> {
  try {
    const newPost = await PostModel.create(post);
    return newPost;
  } catch (err) {
    console.log("err", err);
    throw new Error("Error creating post");
  }
}

export async function updatePost(
  postId: string,
  updatedPost: Post
): Promise<Post | null> {
  const updated = await PostModel.findByIdAndUpdate(postId, updatedPost, {
    new: true,
  }).exec();
  return updated;
}

export async function deletePost(postId: string): Promise<boolean> {
  const result = await PostModel.findByIdAndDelete(postId).exec();
  return !!result;
}
