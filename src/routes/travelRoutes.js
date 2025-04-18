import express from "express";
const router = express.Router();
import {
  createBooking,
  getTravelOptions,
  getUserBookings,
  updateBooking,
} from "../controllers/travelController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.get("/list", authMiddleware, getTravelOptions);
router.post("/book", authMiddleware, createBooking);
router.put("/book", authMiddleware, updateBooking);
router.get("/get-all-bookings", authMiddleware, getUserBookings);

export default router;
