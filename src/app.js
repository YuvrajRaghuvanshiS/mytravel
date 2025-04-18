const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const travelRoutes = require("./routes/travelRoutes");
const agencyRoutes = require("./routes/agencyRoutes");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/agencies", agencyRoutes);

module.exports = app;
