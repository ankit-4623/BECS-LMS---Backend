const express = require("express");
const {
    createRecordedLecture,
    getAllRecordedLectures,
    getRecordedLecturesByCourseId,
    getRecordedLectureById,
    updateRecordedLecture,
    deleteRecordedLecture
} = require("../../controllers/instructor-controller/recorded-lecture-controller");
const { auth } = require("../../middleware/auth-middleware");
const { isInstructor } = require("../../middleware/role-middleware");

const router = express.Router();

// Protected routes - require authentication and instructor role
router.post("/create", auth, isInstructor, createRecordedLecture);
router.get("/get", auth, isInstructor, getAllRecordedLectures);
router.get("/course/:courseId", auth, getRecordedLecturesByCourseId);
router.get("/get/:id", auth, getRecordedLectureById);
router.put("/update/:id", auth, isInstructor, updateRecordedLecture);
router.delete("/delete/:id", auth, isInstructor, deleteRecordedLecture);

module.exports = router;
