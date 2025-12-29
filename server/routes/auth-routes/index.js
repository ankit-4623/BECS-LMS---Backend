const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyOtp,
} = require("../../controllers/auth-controller/index");
const { auth } = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyOtp);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);
router.get("/check-auth", auth, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});

module.exports = router;
