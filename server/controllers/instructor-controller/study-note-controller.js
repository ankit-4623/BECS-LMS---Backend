const StudyNote = require("../../models/StudyNote");
const Course = require("../../models/Course");

// Create a new study note
const createStudyNote = async (req, res) => {
    try {
        const { 
            courseId, 
            title, 
            description, 
            chapterName, 
            lectureNumber, 
            driveLink,
            isIndependent,
            pricing,
            category,
            level,
            image
        } = req.body;
        const instructorId = req.user._id;

        // If note is linked to a course, verify course exists
        if (courseId && !isIndependent) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }
        }

        // Validate Google Drive link format
        const driveRegex = /^https:\/\/(drive\.google\.com|docs\.google\.com)\/.+/i;
        if (!driveRegex.test(driveLink)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Google Drive link format"
            });
        }

        const newStudyNote = new StudyNote({
            courseId: isIndependent ? null : courseId,
            title,
            description,
            chapterName: chapterName || '',
            lectureNumber: lectureNumber || 1,
            driveLink,
            instructorId,
            isIndependent: isIndependent || false,
            pricing: pricing || 0,
            category: category || '',
            level: level || '',
            image: image || null,
        });

        await newStudyNote.save();

        res.status(201).json({
            success: true,
            message: "Study note created successfully",
            data: newStudyNote
        });

    } catch (error) {
        console.error('Error in createStudyNote:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while creating study note",
            error: error.message
        });
    }
};

// Get all study notes
const getAllStudyNotes = async (req, res) => {
    try {
        const studyNotes = await StudyNote.find({})
            .populate('courseId', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: studyNotes
        });

    } catch (error) {
        console.error('Error in getAllStudyNotes:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching study notes",
            error: error.message
        });
    }
};

// Get study notes by course ID
const getStudyNotesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        const studyNotes = await StudyNote.find({ courseId })
            .sort({ lectureNumber: 1 });

        res.status(200).json({
            success: true,
            data: studyNotes
        });

    } catch (error) {
        console.error('Error in getStudyNotesByCourseId:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching study notes",
            error: error.message
        });
    }
};

// Get study note by ID
const getStudyNoteById = async (req, res) => {
    try {
        const { id } = req.params;

        const studyNote = await StudyNote.findById(id)
            .populate('courseId', 'title');

        if (!studyNote) {
            return res.status(404).json({
                success: false,
                message: "Study note not found"
            });
        }

        res.status(200).json({
            success: true,
            data: studyNote
        });

    } catch (error) {
        console.error('Error in getStudyNoteById:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching study note",
            error: error.message
        });
    }
};

// Update study note
const updateStudyNote = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const instructorId = req.user._id;

        const studyNote = await StudyNote.findById(id);
        if (!studyNote) {
            return res.status(404).json({
                success: false,
                message: "Study note not found"
            });
        }

        // Verify ownership
        if (studyNote.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this study note"
            });
        }

        // Validate Google Drive link if provided
        if (updateData.driveLink) {
            const driveRegex = /^https:\/\/(drive\.google\.com|docs\.google\.com)\/.+/i;
            if (!driveRegex.test(updateData.driveLink)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Google Drive link format"
                });
            }
        }

        const updatedStudyNote = await StudyNote.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Study note updated successfully",
            data: updatedStudyNote
        });

    } catch (error) {
        console.error('Error in updateStudyNote:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while updating study note",
            error: error.message
        });
    }
};

// Delete study note
const deleteStudyNote = async (req, res) => {
    try {
        const { id } = req.params;
        const instructorId = req.user._id;

        const studyNote = await StudyNote.findById(id);
        if (!studyNote) {
            return res.status(404).json({
                success: false,
                message: "Study note not found"
            });
        }

        // Verify ownership
        if (studyNote.instructorId.toString() !== instructorId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this study note"
            });
        }

        await StudyNote.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Study note deleted successfully"
        });

    } catch (error) {
        console.error('Error in deleteStudyNote:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while deleting study note",
            error: error.message
        });
    }
};

module.exports = {
    createStudyNote,
    getAllStudyNotes,
    getStudyNotesByCourseId,
    getStudyNoteById,
    updateStudyNote,
    deleteStudyNote
};
