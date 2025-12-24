const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String
    },
    userEmail: {
        type: String
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    courseTitle: {
        type: String
    },
    courseImage: {
        type: String
    },
    coursePricing: {
        type: Number
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    instructorName: {
        type: String
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
