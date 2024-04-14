import express from 'express';
const router = express.Router();
import { register } from '@controllers/controller.auth';

router.post('/register', register);

export default router;
