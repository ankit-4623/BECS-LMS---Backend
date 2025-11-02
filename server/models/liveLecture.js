const mongoose = require("mongoose");

const LiveLectureSchema = new mongoose.Schema({
      courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
      },
      gmeetinglink: {
            type: String,
            required: true, 
      },  
}, { timestamps: true }
);

module.exports = mongoose.model("LiveLecture", LiveLectureSchema);