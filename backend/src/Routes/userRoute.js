import express from "express";
import {
  getAllUsers,
  getById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../Controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);

export default router;
