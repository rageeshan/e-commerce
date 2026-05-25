import express from "express";
import {
  getAllUsers,
  getById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  verifyOtp,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../Controllers/userController.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getById);
router.post("/", createUser);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", protect, changePassword);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);

export default router;
