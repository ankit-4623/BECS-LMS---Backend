const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student"
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Keep compatibility with existing unique index on `email` by syncing fields before validation
UserSchema.pre("validate", function(next) {
  // If one of the fields exists, mirror it to the other so both are populated
  if (!this.email && this.userEmail) {
    this.email = this.userEmail;
  }
  if (!this.userEmail && this.email) {
    this.userEmail = this.email;
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);
