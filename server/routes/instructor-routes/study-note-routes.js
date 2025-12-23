const express = require("express");
const {
    createStudyNote,
    getAllStudyNotes,
    getStudyNotesByCourseId,
    getStudyNoteById,
    updateStudyNote,
    deleteStudyNote
} = require("../../controllers/instructor-controller/study-note-controller");
const { auth } = require("../../middleware/auth-middleware");
const { isInstructor } = require("../../middleware/role-middleware");

const router = express.Router();

// Protected routes - require authentication and instructor role
router.post("/create", auth, isInstructor, createStudyNote);
router.get("/get", auth, isInstructor, getAllStudyNotes);
router.get("/course/:courseId", auth, getStudyNotesByCourseId);
router.get("/get/:id", auth, getStudyNoteById);
router.put("/update/:id", auth, isInstructor, updateStudyNote);
router.delete("/delete/:id", auth, isInstructor, deleteStudyNote);

module.exports = router;
