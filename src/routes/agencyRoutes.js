const express = require("express");
const {
  getAgencyInfo,
  updateAgencyProfile,
} = require("../controllers/agencyController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/me", authMiddleware, getAgencyInfo);
router.put("/update-profile", authMiddleware, updateAgencyProfile);

module.exports = router;
