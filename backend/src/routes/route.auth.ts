import express from 'express';
const router = express.Router();
import { register } from '@controllers/controller.user';

router.post('/register', register);

export default router;
