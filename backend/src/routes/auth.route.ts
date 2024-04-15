import express from 'express';
const router = express.Router();
import { register, login } from '@controllers/auth.controller';
import { authMiddleware } from '@middlewares/auth.middleware';

router.post('/register', register);
router.post('/login', login);

export default router;
