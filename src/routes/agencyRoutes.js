import express from "express";
import {
  getAgencyInfo,
  updateAgencyProfile,
} from "../controllers/agencyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getAgencyInfo);
router.put("/update-profile", authMiddleware, updateAgencyProfile);

export default router;
