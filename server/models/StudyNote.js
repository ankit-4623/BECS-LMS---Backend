const mongoose = require("mongoose");

const StudyNoteSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  chapterName: {
    type: String,
    required: true,
    trim: true,
  },
  lectureNumber: {
    type: Number,
    default: 1,
  },
  driveLink: {
    type: String,
    required: true,
  },
  instructorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("StudyNote", StudyNoteSchema);
