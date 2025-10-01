import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getUsers, updateUser, deleteUser } from "../controller/adminController.js";

const router = express.Router();

// Get all users
router.get("/users", protect, adminOnly, getUsers);

// Update a user
router.put("/users/:id", protect, adminOnly, updateUser);

// Delete a user
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
