const express = require("express");
const {
    createLiveLecture,
    getAllLiveLectures,
    updateLiveLecture,
    deleteLiveLecture,
    getLiveLecturesByCourseId,
    updateLiveLectureStatus
} = require("../../controllers/instructor-controller/live-lecture-controller");
const { auth } = require("../../middleware/auth-middleware");
const { isInstructor } = require("../../middleware/role-middleware");

const router = express.Router();

// Protected routes - require authentication and instructor role
router.post("/create", auth, isInstructor, createLiveLecture);
router.get("/get", auth, isInstructor, getAllLiveLectures);
router.get("/course/:courseId", auth, getLiveLecturesByCourseId);
router.put("/update/:id", auth, isInstructor, updateLiveLecture);
router.patch("/status/:id", auth, isInstructor, updateLiveLectureStatus);
router.delete("/delete/:id", auth, isInstructor, deleteLiveLecture);

module.exports = router;