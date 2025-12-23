const mongoose = require("mongoose");

const RecordedLectureSchema = new mongoose.Schema({
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
  chapterName: {
    type: String,
    required: true,
    trim: true,
  },
  lectureNumber: {
    type: Number,
    default: 1,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: "00:00",
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

module.exports = mongoose.model("RecordedLecture", RecordedLectureSchema);
