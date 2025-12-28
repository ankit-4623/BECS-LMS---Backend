const express = require("express");
const { getRecordedLecturesByCourseId } = require("../../controllers/student-controller/recorded-lecture-controller");
const { auth } = require("../../middleware/auth-middleware");

const router = express.Router();

// Get recorded lectures by course ID (for authenticated students)
router.get("/course/:courseId", auth, getRecordedLecturesByCourseId);

module.exports = router;