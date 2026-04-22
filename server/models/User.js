const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "resident", "security"],
      default: "resident",
    },

    flatNumber: String,

    resetToken: String,
    resetTokenExpire: Date,

    otp: String,
    otpExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);