const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  text: String,
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);