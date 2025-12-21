const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true,
    
  },
  notesUrl: {
    type: String,
    
  },
  public_id: String,
  freePreview: {
    type: Boolean,
    default: false
  },
  duration: {
    type: String,
    default: "00:00"
  }
});

const CourseSchema = new mongoose.Schema({ 
  date: Date,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  image: {
    type: String,
    required: true,
    public_id: String,
    url: String,
    },
  welcomeMessage: String,
  pricing: Number,
  objectives: String,
  students: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  teachers: {
    teacherName: String,
    degree: String,
    experience: String,
  },
  curriculum: [LectureSchema],
  isPublised: {
    type: Boolean,
    default: false
  },
  totalDuration: {
    type: String,
    default: "00:00"
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Course", CourseSchema);
