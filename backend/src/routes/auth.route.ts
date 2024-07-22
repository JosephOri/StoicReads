import express from "express";
const router = express.Router();
import {
  register,
  login,
  logout,
  googleLogin,
  getUser,
} from "@controllers/auth.controller";
import { authMiddleware } from "@middlewares/auth.middleware";

router.post("/register", register);
router.post("/google/login", googleLogin);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/user", getUser);

export default router;
