require("dotenv").config();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../../config/redis");
const { publishToQueue } = require("../../config/rabbitmq");



const registerUser = async (req, res) => {
  const { userName, userEmail, password } = req.body;

  // Basic validation: userName and userEmail are required; password is optional for resend
  if (!userName || !userEmail) {
    return res.status(400).json({ success: false, message: 'userName and userEmail are required' });
  }

  const existingUser = await User.findOne({
    $or: [{ email: userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  // If password not provided (resend flow), generate a secure random one and hash it
  const plainPassword = password && typeof password === 'string' && password.length ? password : require('crypto').randomBytes(16).toString('hex');
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

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
      userEmail,
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
  const { userEmail, email: emailFromBody, password } = req.body;
  const lookupEmail = userEmail || emailFromBody;

  if (!lookupEmail || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const checkUser = await User.findOne({ $or: [{ userEmail: lookupEmail }, { email: lookupEmail }] });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Update last login time
  checkUser.lastLogin = new Date();
  await checkUser.save();

  const userEmailToReturn = checkUser.userEmail || checkUser.email;

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: userEmailToReturn,
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
        userEmail: userEmailToReturn,
        role: checkUser.role,
      },
    },
  });
};

const logoutUser = async (req, res) => {
  try {
    
    const userId = req.user?._id;

    if (userId) {
      
      await User.findByIdAndUpdate(userId, {
        lastLogin: new Date(),
      });
    }

    
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
  try {
    const { userEmail, otp } = req.body;
    console.log(req.body)

    if (!userEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

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

    const existingUser = await User.findOne({ $or: [{ userEmail: userEmail }, { email: userEmail }] });
    if (existingUser) {      
      await redisClient.del(otpKey);
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    const newUser = await User.create({
      userName: parsedData.userName,
      userEmail: userEmail,
      email: userEmail,
      password: parsedData.password,
    });

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
  } catch (error) {
    console.error(error);
    if (error && error.code === 11000) {
      
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = { registerUser, loginUser, logoutUser, verifyOtp };
