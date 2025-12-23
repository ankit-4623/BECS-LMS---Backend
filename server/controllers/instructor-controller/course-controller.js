const Course = require("../../models/Course");
const { uploadMediaToCloudinary, deleteMediaFromCloudinary } = require("../../helpers/cloudinary");



const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    
    // Parse teachers if it's a JSON string (from FormData)
    if (typeof courseData.teachers === 'string') {
      try {
        courseData.teachers = JSON.parse(courseData.teachers);
      } catch (parseErr) {
        courseData.teachers = {};
      }
    }
    
    // Parse isPublished if it's a string
    if (typeof courseData.isPublished === 'string') {
      courseData.isPublished = courseData.isPublished === 'true';
    }
    
    // Parse pricing if it's a string
    if (typeof courseData.pricing === 'string') {
      courseData.pricing = Number(courseData.pricing) || 0;
    }
    
    // Handle image upload if file is present
    if (req.file) {
      try {
        const result = await uploadMediaToCloudinary(req.file.path);
        courseData.image = {
          url: result.secure_url,
          public_id: result.public_id
        };
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Error uploading image",
          error: uploadError.message
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Course image is required"
      });
    }

    // Add instructor details from authenticated user
    courseData.teachers = {
      teacherId: req.user._id,
      teacherName: req.user.userName,
      ...courseData.teachers
    };
    
    courseData.lastUpdated = new Date();
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: saveCourse,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while creating course",
      error: e.message
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;
    const instructorId = req.user._id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }

    // Find existing course
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!"
      });
    }

    // Verify course ownership
    if (existingCourse.teachers.teacherId.toString() !== instructorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this course"
      });
    }

    // Handle image update if new file is uploaded
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (existingCourse.image && existingCourse.image.public_id) {
          await deleteMediaFromCloudinary(existingCourse.image.public_id);
        }

        // Upload new image
        const result = await uploadMediaToCloudinary(req.file.path);
        updatedCourseData.image = {
          url: result.secure_url,
          public_id: result.public_id
        };
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Error updating course image",
          error: uploadError.message
        });
      }
    }

    // Update lastUpdated timestamp
    updatedCourseData.lastUpdated = new Date();

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating course",
      error: e.message
    });
  }
};

const deleteCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const instructorId = req.user._id; // Get instructor ID from auth middleware

    // Find the course
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found!"
      });
    }

    // Verify course ownership (assuming teachers object has teacherId)
    if (course.teachers.teacherId && course.teachers.teacherId.toString() !== instructorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this course"
      });
    }

    // Check if course has enrolled students
    if (course.students && course.students.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete course with enrolled students"
      });
    }

    // Delete course
    await Course.findByIdAndDelete(id);

    // Delete course image from Cloudinary
    if (course.image && course.image.public_id) {
      try {
        await deleteMediaFromCloudinary(course.image.public_id);
      } catch (deleteError) {
        console.error('Error deleting course image:', deleteError);
      }
    }

    // Delete curriculum files from Cloudinary
    if (course.curriculum && course.curriculum.length > 0) {
      for (const lecture of course.curriculum) {
        if (lecture.public_id) {
          try {
            await deleteMediaFromCloudinary(lecture.public_id);
          } catch (deleteError) {
            console.error('Error deleting lecture file:', deleteError);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting course",
      error: e.message
    });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
  deleteCourseByID,
};
