import express from 'express';
import upload from '@config/multer.config';
import * as postController from '../controllers/post.controller';

const router = express.Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/user/:userName', postController.getPostsByUserName);
router.post('/', upload.single('image'), postController.createPost);
router.put('/:id', upload.single('image'), postController.updatePost);
router.delete('/:id', postController.deletePost);
router.get('/uploads/:filename', postController.getImage);
// router.get('/hasUserPosts/:userName', postController.hasUserPosts);

export default router;
