import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import travelRoutes from "./routes/travelRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";

const app = express();
app.use(cors());

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/wallet", walletRoutes);

export default app;
