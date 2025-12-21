const express = require("express");
const { uploadMedia, deleteMedia } = require("../../controllers/instructor-controller/media-controller");
const { auth } = require("../../middleware/auth-middleware");
const { isInstructor } = require("../../middleware/role-middleware");
const upload = require("../../middleware/multer-middleware");

const router = express.Router();

// Protected routes - require authentication and instructor role
router.post("/upload", auth, isInstructor, upload.single('media'), uploadMedia);
router.delete("/delete/:publicId", auth, isInstructor, deleteMedia);

module.exports = router;