const mongoose = require("mongoose");

const LiveLectureSchema = new mongoose.Schema({
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
      scheduledAt: {
            type: Date,
            required: true,
      },
      duration: {
            type: Number,
            default: 60, // duration in minutes
      },
      meetingLink: {
            type: String,
            required: true,
      },
      instructorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
      },
      instructorName: {
            type: String,
            required: true,
      },
      status: {
            type: String,
            enum: ["scheduled", "live", "completed", "cancelled"],
            default: "scheduled",
      },
}, { timestamps: true }
);

module.exports = mongoose.model("LiveLecture", LiveLectureSchema);