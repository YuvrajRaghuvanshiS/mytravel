import express from "express";
const router = express.Router();
import {
  createBooking,
  getTravelOptions,
} from "../controllers/travelController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.get("/list", authMiddleware, getTravelOptions);
router.post("/book", authMiddleware, createBooking);

export default router;
