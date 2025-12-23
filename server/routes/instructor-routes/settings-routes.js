const express = require("express");
const { getDashboardStats } = require("../../controllers/instructor-controller/settings-controller");
const { auth } = require("../../middleware/auth-middleware");
const { isInstructor } = require("../../middleware/role-middleware");

const router = express.Router();

// Protected routes - require authentication and instructor role
router.get("/stats", auth, isInstructor, getDashboardStats);

module.exports = router;
