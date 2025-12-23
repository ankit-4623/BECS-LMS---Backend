const RecordedLecture = require("../../models/RecordedLecture");
const Course = require("../../models/Course");

// Create a new recorded lecture
const createRecordedLecture = async (req, res) => {
    try {
        const { courseId, title, chapterName, lectureNumber, videoUrl, duration } = req.body;
        const instructorId = req.user._id;

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Validate YouTube link format
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
        if (!youtubeRegex.test(videoUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid YouTube link format"
            });
        }

        const newRecordedLecture = new RecordedLecture({
            courseId,
            title,
            chapterName,
            lectureNumber,
            videoUrl,
            duration,
            instructorId
        });

        await newRecordedLecture.save();

        res.status(201).json({
            success: true,
            message: "Recorded lecture created successfully",
            data: newRecordedLecture
        });

    } catch (error) {
        console.error('Error in createRecordedLecture:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while creating recorded lecture",
            error: error.message
        });
    }
};

// Get all recorded lectures
const getAllRecordedLectures = async (req, res) => {
    try {
        const recordedLectures = await RecordedLecture.find({})
            .populate('courseId', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: recordedLectures
        });

    } catch (error) {
        console.error('Error in getAllRecordedLectures:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching recorded lectures",
            error: error.message
        });
    }
};

// Get recorded lectures by course ID
const getRecordedLecturesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        const recordedLectures = await RecordedLecture.find({ courseId })
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

// Get recorded lecture by ID
const getRecordedLectureById = async (req, res) => {
    try {
        const { id } = req.params;

        const recordedLecture = await RecordedLecture.findById(id)
            .populate('courseId', 'title');

        if (!recordedLecture) {
            return res.status(404).json({
                success: false,
                message: "Recorded lecture not found"
            });
        }

        res.status(200).json({
            success: true,
            data: recordedLecture
        });

    } catch (error) {
        console.error('Error in getRecordedLectureById:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching recorded lecture",
            error: error.message
        });
    }
};

// Update recorded lecture
const updateRecordedLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const instructorId = req.user._id;

        const recordedLecture = await RecordedLecture.findById(id);
        if (!recordedLecture) {
            return res.status(404).json({
                success: false,
                message: "Recorded lecture not found"
            });
        }

        // Verify ownership
        if (recordedLecture.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this recorded lecture"
            });
        }

        // Validate YouTube link if provided
        if (updateData.videoUrl) {
            const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;
            if (!youtubeRegex.test(updateData.videoUrl)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid YouTube link format"
                });
            }
        }

        const updatedRecordedLecture = await RecordedLecture.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Recorded lecture updated successfully",
            data: updatedRecordedLecture
        });

    } catch (error) {
        console.error('Error in updateRecordedLecture:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while updating recorded lecture",
            error: error.message
        });
    }
};

// Delete recorded lecture
const deleteRecordedLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const instructorId = req.user._id;

        const recordedLecture = await RecordedLecture.findById(id);
        if (!recordedLecture) {
            return res.status(404).json({
                success: false,
                message: "Recorded lecture not found"
            });
        }

        // Verify ownership
        if (recordedLecture.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this recorded lecture"
            });
        }

        await RecordedLecture.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Recorded lecture deleted successfully"
        });

    } catch (error) {
        console.error('Error in deleteRecordedLecture:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while deleting recorded lecture",
            error: error.message
        });
    }
};

module.exports = {
    createRecordedLecture,
    getAllRecordedLectures,
    getRecordedLecturesByCourseId,
    getRecordedLectureById,
    updateRecordedLecture,
    deleteRecordedLecture
};
