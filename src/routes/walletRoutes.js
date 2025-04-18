import express from "express";
const router = express.Router();

import { addMoneyToWallet } from "../controllers/walletController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

router.post("/add-money", authMiddleware, addMoneyToWallet);

export default router;
