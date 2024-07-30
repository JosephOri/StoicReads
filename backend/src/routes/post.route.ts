import express from "express";
import upload from "@config/multer.config";
import * as postController from "../controllers/post.controller";

const router = express.Router();

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userName:
 *                     type: string
 *                   book:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       authors:
 *                         type: array
 *                         items:
 *                           type: string
 *                       image:
 *                         type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         userName:
 *                           type: string
 *                         content:
 *                           type: string
 *                   review:
 *                     type: object
 *                     properties:
 *                       rating:
 *                         type: integer
 *                       description:
 *                         type: string
 *                   image:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", postController.getAllPosts);

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: The post description by ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 book:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: string
 *                     image:
 *                       type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userName:
 *                         type: string
 *                       content:
 *                         type: string
 *                 review:
 *                   type: object
 *                   properties:
 *                     rating:
 *                       type: integer
 *                     description:
 *                       type: string
 *                 image:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Post not found
 */
router.get("/:id", postController.getPostById);

/**
 * @swagger
 * /post/user/{userName}:
 *   get:
 *     summary: Get posts by username
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userName
 *         schema:
 *           type: string
 *         required: true
 *         description: The username
 *     responses:
 *       200:
 *         description: List of posts by username
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userName:
 *                     type: string
 *                   book:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       authors:
 *                         type: array
 *                         items:
 *                           type: string
 *                       image:
 *                         type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         userName:
 *                           type: string
 *                         content:
 *                           type: string
 *                   review:
 *                     type: object
 *                     properties:
 *                       rating:
 *                         type: integer
 *                       description:
 *                         type: string
 *                   image:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Posts not found
 */
router.get("/user/:userName", postController.getPostsByUser);

/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               bookTitle:
 *                 type: string
 *               bookAuthors:
 *                 type: array
 *                 items:
 *                   type: string
 *               bookImage:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The post was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 book:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     authors:
 *                       type: array
 *                       items:
 *                         type: string
 *                     image:
 *                       type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 rating:
 *                   type: integer
 *                 description:
 *                   type: string
 *                 image:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.post("/", upload.single("image"), postController.createPost);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The post was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 rating:
 *                   type: integer
 *                 description:
 *                     type: string
 *                 imagePath:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Post not found
 */
router.put("/:id", upload.single("image"), postController.updatePost);

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: The post was deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete("/:id", postController.deletePost);

/**
 * @swagger
 * /post/uploads/{filename}:
 *   get:
 *     summary: Get an uploaded image by filename
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The image filename
 *     responses:
 *       200:
 *         description: The image file
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
router.get("/uploads/:filename", postController.getImage);

export default router;
