const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");
const User = require("../../models/User");
const crypto = require('crypto');

const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user._id; // Changed from req.user.id to req.user._id

        console.log('[Order] Creating order - courseId:', courseId, 'userId:', userId);

        // Validate if course exists and get course details
        const course = await Course.findById(courseId);
        if (!course) {
            console.log('[Order] Course not found:', courseId);
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Get user details
        const user = await User.findById(userId);
        if (!user) {
            console.log('[Order] User not found:', userId);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('[Order] Found course:', course.title, 'and user:', user.userName);

        // Create Razorpay Order
        const options = {
            amount: Math.round(course.pricing * 100), // Razorpay expects amount in paise
            currency: "INR",
            receipt: `order_rcptid_${Date.now()}`
        };

        try {
            const razorpayOrder = await razorpay.orders.create(options);
            
            // Create order in our database with all required fields
            const order = await Order.create({
                userId: userId,
                userName: user.userName,
                userEmail: user.userEmail,
                courseId: courseId,
                courseTitle: course.title,
                courseImage: course.image?.url || '',
                coursePricing: course.pricing,
                instructorId: course.teachers?.teacherId,
                instructorName: course.teachers?.teacherName,
                razorpayOrderId: razorpayOrder.id,
                amount: course.pricing,
                currency: 'INR',
                status: 'pending',
                orderDate: new Date()
            });

            res.status(200).json({
                success: true,
                data: {
                    orderId: order._id,
                    razorpayOrderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    keyId: process.env.RAZORPAY_KEY_ID
                }
            });
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating order',
                error: error.message
            });
        }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        // Find the order
        const order = await Order.findOne({ razorpayOrderId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify signature
        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            order.status = 'failed';
            await order.save();
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Update order status
        order.status = 'successful';
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;

    await order.save();

    //update out student course model
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    //update the course schema students
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { createOrder, verifyPayment };
