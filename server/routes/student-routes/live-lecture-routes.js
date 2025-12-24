const express = require("express");
const {
  getLiveLecturesByCourseId,
  getAllUpcomingLiveLectures
} = require("../../controllers/student-controller/live-lecture-controller");

const router = express.Router();

// Public routes - students can view live lecture info
router.get("/course/:courseId", getLiveLecturesByCourseId);
router.get("/upcoming", getAllUpcomingLiveLectures);

module.exports = router;
