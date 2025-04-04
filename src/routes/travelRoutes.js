const express = require("express");
const {
  addTravelOption,
  updateTravelOption,
  removeTravelOption,
  getAgencyTravelOptions,
} = require("../controllers/travelController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, addTravelOption);
router.put("/update/:id", authMiddleware, updateTravelOption);
router.delete("/remove/:id", authMiddleware, removeTravelOption);
router.get("/list", authMiddleware, getAgencyTravelOptions);

module.exports = router;
