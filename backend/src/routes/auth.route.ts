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
} from "@controllers/auth.controller";
import { authMiddleware } from "@middlewares/auth.middleware";

router.post("/register", register);
router.post("/google/login", googleLogin);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/user", getUser);
router.put("/update/:userId", updateUser);
router.delete("/delete/:userId", deleteUser);

export default router;
