const LiveLecture = require("../../models/liveLecture");

// Get live lectures by course ID (for students)
const getLiveLecturesByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const liveLectures = await LiveLecture.find({ 
      courseId,
      status: { $in: ['scheduled', 'live'] } // Only show scheduled or live lectures
    }).sort({ scheduledAt: 1 });

    // If we found lectures, return the first one (or all)
    if (liveLectures.length > 0) {
      res.status(200).json({
        success: true,
        data: liveLectures[0], // Return the upcoming/current live lecture
        allLectures: liveLectures
      });
    } else {
      res.status(200).json({
        success: true,
        data: null,
        message: "No live lectures scheduled for this course"
      });
    }

  } catch (error) {
    console.error('Error in getLiveLecturesByCourseId:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching live lectures",
      error: error.message
    });
  }
};

// Get all upcoming live lectures (for student dashboard)
const getAllUpcomingLiveLectures = async (req, res) => {
  try {
    const liveLectures = await LiveLecture.find({ 
      status: { $in: ['scheduled', 'live'] },
      scheduledAt: { $gte: new Date() }
    })
    .populate('courseId', 'title image')
    .sort({ scheduledAt: 1 });

    res.status(200).json({
      success: true,
      data: liveLectures
    });

  } catch (error) {
    console.error('Error in getAllUpcomingLiveLectures:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching live lectures",
      error: error.message
    });
  }
};

module.exports = {
  getLiveLecturesByCourseId,
  getAllUpcomingLiveLectures
};
