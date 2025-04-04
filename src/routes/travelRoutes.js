const express = require("express");
const router = express.Router();
const { getTravelOptions } = require("../controllers/travelController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/list", authMiddleware, getTravelOptions);

module.exports = router;
