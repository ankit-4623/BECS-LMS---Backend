const express = require("express");
const router = express.Router();
const {
    createOrder,
    verifyPayment
} = require("../../controllers/student-controller/order-controller");
const { auth } = require("../../middleware/auth-middleware");

// Protected routes - require authentication
router.post("/create", auth, createOrder);
router.post("/verify", auth, verifyPayment);

module.exports = router;
