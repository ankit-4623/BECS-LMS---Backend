const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
};

const authenticate = (req, res, next) => {
  try {
    // Check for token in different places
    const token = 
      req.headers.authorization?.split(" ")[1] || // Bearer token
      req.cookies?.token || // Cookie
      req.body?.token || // Request body
      req.query?.token; // Query parameter

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    // Verify the token
    const payload = verifyToken(token);
    
    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return res.status(401).json({
        success: false,
        message: "Token has expired"
      });
    }

    // Add user data to request
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: e.message
    });
  }
};

module.exports = {
  auth: authenticate
};
