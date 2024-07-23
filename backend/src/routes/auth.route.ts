import express from 'express';
const router = express.Router();
import {
  register,
  login,
  logout,
  googleLogin,
  getUser,
  updateUser,
  deleteUser,
} from '@controllers/auth.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import upload from '@config/multer.config';

router.post('/register', upload.single('image'), register);
router.post('/google/login', googleLogin);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/user', getUser);
router.put('/update/:userId', upload.single('image'), updateUser);
router.delete('/delete/:userId', deleteUser);

export default router;
