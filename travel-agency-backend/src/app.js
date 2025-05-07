import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import travelRoutes from "./routes/travelRoutes.js";
import agencyRoutes from "./routes/agencyRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/wallet", walletRoutes);

export default app;
