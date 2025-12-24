const mongoose = require("mongoose");

const StudyNoteSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: false, // Made optional for independent notes
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
  // New fields for independent purchasable notes
  isIndependent: {
    type: Boolean,
    default: false, // true = can be purchased without a course
  },
  pricing: {
    type: Number,
    default: 0, // 0 means free
  },
  category: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', ''],
    default: '',
  },
  image: {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  purchasedBy: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    studentName: String,
    studentEmail: String,
    paidAmount: Number,
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

module.exports = mongoose.model("StudyNote", StudyNoteSchema);
