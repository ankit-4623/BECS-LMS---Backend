const LiveLecture = require("../../models/liveLecture");
const Course = require("../../models/Course");

// Create a new live lecture
const createLiveLecture = async (req, res) => {
    try {
        const { courseId, title, description, scheduledAt, duration, meetingLink } = req.body;
        const instructorId = req.user._id;
        const instructorName = req.user.userName;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Validate Google Meet link format
        const gmeetRegex = /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i;
        if (!gmeetRegex.test(meetingLink)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Google Meet link format"
            });
        }

        const newLiveLecture = new LiveLecture({
            courseId,
            title,
            description,
            scheduledAt: new Date(scheduledAt),
            duration: duration || 60,
            meetingLink,
            instructorId,
            instructorName,
            status: "scheduled"
        });

        await newLiveLecture.save();

        res.status(201).json({
            success: true,
            message: "Live lecture created successfully",
            data: newLiveLecture
        });

    } catch (error) {
        console.error('Error in createLiveLecture:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while creating live lecture",
            error: error.message
        });
    }
};

// Get all live lectures
const getAllLiveLectures = async (req, res) => {
    try {
        const liveLectures = await LiveLecture.find({})
            .populate('courseId', 'title')
            .sort({ scheduledAt: -1 });

        res.status(200).json({
            success: true,
            data: liveLectures
        });

    } catch (error) {
        console.error('Error in getAllLiveLectures:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching live lectures",
            error: error.message
        });
    }
};

// Update live lecture
const updateLiveLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const instructorId = req.user._id;

        const liveLecture = await LiveLecture.findById(id);
        if (!liveLecture) {
            return res.status(404).json({
                success: false,
                message: "Live lecture not found"
            });
        }

        // Verify ownership
        if (liveLecture.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this live lecture"
            });
        }

        // Validate Google Meet link if provided
        if (updateData.meetingLink) {
            const gmeetRegex = /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i;
            if (!gmeetRegex.test(updateData.meetingLink)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Google Meet link format"
                });
            }
        }

        if (updateData.scheduledAt) {
            updateData.scheduledAt = new Date(updateData.scheduledAt);
        }

        const updatedLiveLecture = await LiveLecture.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Live lecture updated successfully",
            data: updatedLiveLecture
        });

    } catch (error) {
        console.error('Error in updateLiveLecture:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while updating live lecture",
            error: error.message
        });
    }
};

const deleteLiveLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const instructorId = req.user._id;

        const liveLecture = await LiveLecture.findById(id);
        if (!liveLecture) {
            return res.status(404).json({
                success: false,
                message: "Live lecture not found"
            });
        }

        // Verify ownership
        if (liveLecture.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this live lecture"
            });
        }

        await LiveLecture.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Live lecture deleted successfully"
        });

    } catch (error) {
        console.error('Error in deleteLiveLecture:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while deleting live lecture",
            error: error.message
        });
    }
};

const getLiveLecturesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        const liveLectures = await LiveLecture.find({ courseId })
            .sort({ scheduledAt: -1 });

        res.status(200).json({
            success: true,
            data: liveLectures
        });

    } catch (error) {
        console.error('Error in getLiveLecturesByCourseId:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching live lectures",
            error: error.message
        });
    }
};

// Update live lecture status
const updateLiveLectureStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const instructorId = req.user._id;

        const validStatuses = ["scheduled", "live", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const liveLecture = await LiveLecture.findById(id);
        if (!liveLecture) {
            return res.status(404).json({
                success: false,
                message: "Live lecture not found"
            });
        }

        // Verify ownership
        if (liveLecture.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this live lecture"
            });
        }

        liveLecture.status = status;
        await liveLecture.save();

        res.status(200).json({
            success: true,
            message: "Live lecture status updated successfully",
            data: liveLecture
        });

    } catch (error) {
        console.error('Error in updateLiveLectureStatus:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while updating live lecture status",
            error: error.message
        });
    }
};

module.exports = {
    createLiveLecture,
    getAllLiveLectures,
    updateLiveLecture,
    deleteLiveLecture,
    getLiveLecturesByCourseId,
    updateLiveLectureStatus
};