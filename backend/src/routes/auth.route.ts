import express from 'express';
const router = express.Router();
import { register, login, logout, googleLogin } from '@controllers/auth.controller';
import { authMiddleware } from '@middlewares/auth.middleware';

router.post('/register', register);
router.post('/google' ,googleLogin);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

export default router;
