const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// ✅ GET ALL NOTIFICATIONS
router.get("/", async (req, res) => {
  const data = await Notification.find().sort({ createdAt: -1 });
  res.json(data);
});

// 🔥 ADD THIS HERE (IMPORTANT)
router.put("/read-all", async (req, res) => {
  try {
    await Notification.updateMany({}, { isRead: true });
    res.json({ msg: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;