import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMe } from "../controller/userController.js";

const router = express.Router();

router.get("/me", protect, getMe);

export default router;
