const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  deleteCourseByID,
} = require("../../controllers/instructor-controller/course-controller");
const { auth } = require("../../middleware/auth-middleware");
const { isInstructor } = require("../../middleware/role-middleware");

const router = express.Router();

const upload = require("../../middleware/multer-middleware");

router.post("/add", auth, isInstructor, upload.single('image'), addNewCourse);
router.get("/get", auth, isInstructor, getAllCourses);
router.get("/get/details/:id", auth, isInstructor, getCourseDetailsByID);
router.put("/update/:id", auth, isInstructor, upload.single('image'), updateCourseByID);
router.delete("/delete/:id", auth, isInstructor, deleteCourseByID);

module.exports = router;
