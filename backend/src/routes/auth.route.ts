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
  updateById,
  getById,
  getOnlineUsers,
} from "@controllers/auth.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import upload from "@config/multer.config";

router.get("/", getAll);
router.post("/online-users", getOnlineUsers); //auth?
// router.get("/:id", getById);
// router.put("/:id", updateById);
// router.delete("/:id", deleteById);
router.post("/register", upload.single("image"), register);
router.post("/google/login", googleLogin);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/user", getUser);
router.put("/update/:userId", upload.single("image"), updateUser);
router.delete("/delete/:userId", deleteUser);

export default router;
