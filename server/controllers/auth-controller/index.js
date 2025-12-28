require("dotenv").config();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../../config/redis");
const { publishToQueue } = require("../../config/rabbitmq");



const registerUser = async (req, res) => {
  const { userName, userEmail, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  const rateLimitKey = `otp:ratelimit:${userEmail}`;
  const rateLimit = await redisClient.get(rateLimitKey);
  if (rateLimit) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${userEmail}`;
  await redisClient.set(
    otpKey,
    JSON.stringify({
      otp,
      userName,      
      password: hashedPassword,
    }),
    {
      EX: 300, // OTP expires in 5 minutes
    }
  );

  await redisClient.set(rateLimitKey, "true", {
    EX: 60, // Rate limit for 1 minute
  });

   const message = {
    to: userEmail,
    subject: "Your otp code",
    body: `Your OTP is ${otp}. It is valid for 5 minutes`,
  };

  await publishToQueue("send-otp", message);

  return res.status(201).json({
    success: true,
    message: "otp send to email successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Update last login time
  checkUser.lastLogin = new Date();
  await checkUser.save();

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    process.env.JWT_SECRET || "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

const logoutUser = async (req, res) => {
  try {
    // Get user from auth middleware
    const userId = req.user?._id;

    if (userId) {
      // Update last activity timestamp
      await User.findByIdAndUpdate(userId, {
        lastLogin: new Date(),
      });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message,
    });
  }
};

const verifyOtp = async (req, res) => {
  const { userEmail, otp } = req.body;

  const otpKey = `otp:${userEmail}`;
  const data = await redisClient.get(otpKey);

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  } 
  const parsedData = JSON.parse(data);

  if (parsedData.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  const newUser = new User({
    userName: parsedData.userName,
    userEmail,
    password: parsedData.password,
  });

  await newUser.save();

  await redisClient.del(otpKey);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      _id: newUser._id,
      userName: newUser.userName,
      userEmail: newUser.userEmail,
    },
  });
};

module.exports = { registerUser, loginUser, logoutUser, verifyOtp };
