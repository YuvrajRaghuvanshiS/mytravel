const express = require("express");
const router = express.Router();
const { getCustomerInfo } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, getCustomerInfo);

module.exports = router;
