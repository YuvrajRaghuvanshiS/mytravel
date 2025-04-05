import express from "express";
const router = express.Router();
import { getCustomerInfo } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
router.get("/me", authMiddleware, getCustomerInfo);

export default router;
