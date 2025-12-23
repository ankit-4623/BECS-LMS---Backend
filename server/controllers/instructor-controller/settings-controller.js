const Course = require("../../models/Course");
const LiveLecture = require("../../models/liveLecture");
const RecordedLecture = require("../../models/RecordedLecture");
const StudyNote = require("../../models/StudyNote");
const User = require("../../models/User");
const Order = require("../../models/Order");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalCourses,
            liveLectures,
            recordedLectures,
            studyNotes,
            totalStudents,
            totalOrders
        ] = await Promise.all([
            Course.countDocuments({}),
            LiveLecture.countDocuments({}),
            RecordedLecture.countDocuments({}),
            StudyNote.countDocuments({}),
            User.countDocuments({ role: "student" }),
            Order.countDocuments({ orderStatus: "completed" })
        ]);

        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            { $match: { orderStatus: "completed" } },
            { $group: { _id: null, totalRevenue: { $sum: "$orderAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            data: {
                totalCourses,
                liveLectures,
                recordedLectures,
                studyNotes,
                totalStudents,
                totalOrders,
                totalRevenue
            }
        });

    } catch (error) {
        console.error('Error in getDashboardStats:', error);
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching dashboard stats",
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};
