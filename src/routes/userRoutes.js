import express from "express";
const router = express.Router();
import {
  deleteUserAccount,
  getCustomerInfo,
  updateCustomerProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.get("/me", authMiddleware, getCustomerInfo);
router.put("/update-profile", authMiddleware, updateCustomerProfile);
router.put("/delete-account", authMiddleware, deleteUserAccount);
export default router;
