import express from "express";
const router = express.Router();
import { getTravelOptions } from "../controllers/travelController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.get("/list", authMiddleware, getTravelOptions);

export default router;
