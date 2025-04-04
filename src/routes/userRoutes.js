const express = require("express");
const router = express.Router();
const {
  registerCustomer,
  getCustomerInfo,
} = require("../controllers/userController");

router.post("/register", registerCustomer);
router.get("/:id", getCustomerInfo);

module.exports = router;
