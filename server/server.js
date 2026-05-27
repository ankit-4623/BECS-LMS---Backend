const dns = require("node:dns").promises;
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const instructorLiveLectureRoutes = require("./routes/instructor-routes/live-lecture-routes");
const instructorStudyNoteRoutes = require("./routes/instructor-routes/study-note-routes");
const instructorRecordedLectureRoutes = require("./routes/instructor-routes/recorded-lecture-routes");
const instructorSettingsRoutes = require("./routes/instructor-routes/settings-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const studentNoteRoutes = require("./routes/student-routes/note-routes");
const studentLiveLectureRoutes = require("./routes/student-routes/live-lecture-routes");
const studentRecordedLectureRoutes = require("./routes/student-routes/recorded-lecture-routes");
const { redisdb } = require("./config/redis");
const { connectRabbitMQ } = require("./config/rabbitmq");

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGODB_URI;

// CORS configuration
const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];

app.use(cors({ 
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
 }));

app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

//database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongodb is connected"))
  .catch((e) => console.log(e));

// Redis connection

//routes configuration
app.use("/auth", authRoutes);
app.use("/instructor/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/instructor/live-lecture", instructorLiveLectureRoutes);
app.use("/instructor/study-note", instructorStudyNoteRoutes);
app.use("/instructor/recorded-lecture", instructorRecordedLectureRoutes);
app.use("/instructor/settings", instructorSettingsRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student/notes", studentNoteRoutes);
app.use("/student/live-lecture", studentLiveLectureRoutes);
app.use("/student/recorded-lecture", studentRecordedLectureRoutes);

// 404 handler - catches all unmatched routes
app.use((req, res, next) => {
  console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

app.listen(PORT, () => {
  redisdb();
  connectRabbitMQ();
  console.log(`Server is now running on port ${PORT}`);
});
