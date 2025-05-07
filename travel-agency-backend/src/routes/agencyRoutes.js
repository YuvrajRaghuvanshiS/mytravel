import express from "express";
import {
  deleteAgencyAccount,
  getAgencyInfo,
  updateAgencyProfile,
} from "../controllers/agencyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getAgencyInfo);
router.put("/update-profile", authMiddleware, updateAgencyProfile);
router.delete("/delete-agency", authMiddleware, deleteAgencyAccount);

export default router;
