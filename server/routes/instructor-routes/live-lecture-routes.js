const express = require("express");
const {
    createLiveLecture,
    deleteLiveLecture,
    getLiveLectureByCourseId
} = require("../../controllers/instructor-controller/live-lecture-controller");
const { auth } = require("../../middleware/auth-middleware");
const { isInstructor } = require("../../middleware/role-middleware");

const router = express.Router();

// Protected routes - require authentication and instructor role
router.post("/create", auth, isInstructor, createLiveLecture);
router.delete("/delete/:id", auth, isInstructor, deleteLiveLecture);
router.get("/course/:courseId", auth, getLiveLectureByCourseId);

module.exports = router;