const RecordedLecture = require("../../models/RecordedLecture");

// Get recorded lectures by course ID (for students)
const getRecordedLecturesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const recordedLectures = await RecordedLecture.find({
      courseId,
      isPublished: true
    })
    .populate('instructorId', 'userName')
    .sort({ lectureNumber: 1 });

    res.status(200).json({
      success: true,
      data: recordedLectures
    });

  } catch (error) {
    console.error('Error in getRecordedLecturesByCourseId:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching recorded lectures",
      error: error.message
    });
  }
};

module.exports = {
  getRecordedLecturesByCourseId
};