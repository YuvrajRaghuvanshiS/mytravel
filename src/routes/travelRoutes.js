import express from "express";
import {
  addTravelOption,
  updateTravelOption,
  removeTravelOption,
  getAgencyTravelOptions,
  getPublicAgencyTravelOptions,
  receiveBooking,
} from "../controllers/travelController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addTravelOption);
router.put("/update/:id", authMiddleware, updateTravelOption);
router.delete("/remove/:id", authMiddleware, removeTravelOption);
router.get("/list", authMiddleware, getAgencyTravelOptions);

router.get("/public-list", getPublicAgencyTravelOptions);

router.post("/receive-booking", receiveBooking);

export default router;
