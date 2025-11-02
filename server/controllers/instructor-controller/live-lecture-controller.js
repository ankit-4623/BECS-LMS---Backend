const LiveLecture = require("../../models/liveLecture");
const Course = require("../../models/Course");

// Create a new live lecture
const createLiveLecture = async (req, res) => {
    try {
        const { courseId, gmeetinglink } = req.body;
        

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
    

        // Validate Google Meet link format
        const gmeetRegex = /^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i;
        if (!gmeetRegex.test(gmeetinglink)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Google Meet link format"
            });
        }

        const existingLecture = await LiveLecture.findOne({ courseId });
        if (existingLecture) {
            return res.status(400).json({
                success: false,
                message: "A live lecture already exists for this course"
            });
        }
        const newLiveLecture = new LiveLecture({
            courseId,
            gmeetinglink
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

const deleteLiveLecture = async (req, res) => {
    try {
        const { id } = req.params;
      

        const liveLecture = await LiveLecture.findById(id);
        if (!liveLecture) {
            return res.status(404).json({
                success: false,
                message: "Live lecture not found"
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

const getLiveLectureByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        const liveLecture = await LiveLecture.findOne({ courseId });
        if (!liveLecture) {
            return res.status(404).json({
                success: false,
                message: "No live lecture found for this course"
            });
        }

        res.status(200).json({
            success: true,
            data: liveLecture
        });

    } catch (error) {
        console.error('Error in getLiveLectureByCourseId:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching live lecture",
            error: error.message
        });
    }
};

module.exports = {
    createLiveLecture,
    deleteLiveLecture,
    getLiveLectureByCourseId
};