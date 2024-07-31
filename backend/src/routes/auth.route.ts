import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  googleLogin,
  getUser,
  updateUser,
  deleteUser,
  getAll,
  getOnlineUsers,
} from "@controllers/auth.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import upload from "@config/multer.config";

/**
 * @swagger
 * /auth:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The user ID
 *                   userName:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email address
 *                   profileImage:
 *                     type: string
 *                     format: uri
 *                     description: URL to the user's profile image
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time when the user was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date and time when the user was last updated
 *       500:
 *         description: Internal server error
 */
router.get("/", getAll);
/**
 * @swagger
 * /auth/online-users:
 *   post:
 *     summary: Get all online users
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the requesting user
 *                 example: 60c72b2f9b1d4b001f8d4d29
 *     responses:
 *       200:
 *         description: List of online users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The user ID
 *                   userName:
 *                     type: string
 *                     description: The user's name
 *                   socketId:
 *                     type: string
 *                     description: The user's socket ID
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/online-users", getOnlineUsers);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                   format: uri
 *                 tokens:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/register", upload.single("profileImage"), register);

router.post("/google/login", googleLogin);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                   format: uri
 *                 tokens:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful logout
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/logout", authMiddleware, logout);

/**
 * @swagger
 * /auth/user:
 *   get:
 *     summary: Get the current user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                   format: uri
 *                 tokens:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/user", getUser);

/**
 * @swagger
 * /auth/update/{userId}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                   format: uri
 *                 tokens:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put("/update/:userId", upload.single("profileImage"), updateUser);

/**
 * @swagger
 * /auth/delete/{userId}:
 *   delete:
 *     summary: Delete a user by email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user email
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:userId", deleteUser);

export default router;
