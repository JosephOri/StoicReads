import { Request, Response } from "express";
import * as postService from "../services/post.service";
import { IPost } from "../models/Post";
import path from "path";

export async function getAllPosts(req: Request, res: Response): Promise<void> {
  try {
    const posts = await postService.getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json("Error getting posts");
  }
}

export async function getPostById(req: Request, res: Response): Promise<void> {
  const postId = req.params.id;
  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json("Error getting post");
  }
}

export async function getPostsByUserName(
  req: Request,
  res: Response
): Promise<void> {
  const userName = req.params.userName;
  try {
    const posts = await postService.getPostsByUserName(userName);
    // console.log('Posts:', posts);
    if (posts.length === 0) {
      res.status(404).json({ message: "Posts not found" });
    } else {
      res.status(200).json(posts);
    }
  } catch (error) {
    res.status(500).json("Error getting posts");
  }
}

export async function createPost(req: Request, res: Response): Promise<void> {
  try {
    const {
      userName,
      bookTitle,
      bookAuthors,
      bookImage,
      title,
      rating,
      description,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newPost = await postService.createPost({
      userName,
      book: {
        title: bookTitle,
        authors: bookAuthors,
        image: bookImage,
      },
      title,
      rating,
      description,
      image: imagePath,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.log(error, "createPost error");
    res.status(500).json("Error creating post");
  }
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  try {
    const postId = req.params.id;
    const { title, rating, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedPostData = {
      title,
      review: {
        rating,
        description,
      },
      image: imagePath,
    };

    console.log("Updated Post Data:", JSON.stringify(updatedPostData));

    const updatedPost = await postService.updatePost(postId, updatedPostData);

    if (!updatedPost) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    console.log(error, "updatePost error");
    res.status(500).json("Error updating post");
  }
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  const postId = req.params.id;
  try {
    const result = await postService.deletePost(postId);
    if (!result) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json("Error deleting post");
  }
}

export async function addComment(req: Request, res: Response): Promise<void> {
  try {
    const postId = req.params.id;
    const { userName, content } = req.body;
    const post = await postService.addComment(postId, { userName, content });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(201).json(post);
    }
  } catch (error) {
    res.status(500).json("Error adding comment");
  }
}
export const getImage = (req: Request, res: Response) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  console.log("Image Path:", filePath);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ message: "Image not found" });
    }
  });
};
