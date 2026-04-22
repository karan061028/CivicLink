const Announcement = require("../models/Announcement");

// ================= CREATE ANNOUNCEMENT =================
const createAnnouncement = async (req, res) => {
  console.log("🔥 CREATE API HIT"); 
  try {
    const { title, message, type, eventDate, amount, isPaidRequired } = req.body;

    if (!title || !message) {
      return res.status(400).json({ msg: "Title and message are required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      type: type || "general",
      isPaidRequired: isPaidRequired || false,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      amount: amount ? Number(amount) : undefined,
      createdBy: req.user?.id,
    });

    console.log("🔥 EMITTING:", announcement);

// 🔥 ADD THIS 👇
const Notification = require("../models/Notification");

// 🔥 SAVE NOTIFICATION IN DB
const notif = await Notification.create({
  text: `📢 ${announcement.title}`,
});

// SEND NEW NOTIFICATION EVENT
if (global.io) {
  global.io.emit("newNotification", notif);
}

// 🔥 (OPTIONAL) keep old event if needed
// global.io.emit("newAnnouncement", announcement);

// ✅ MUST SEND RESPONSE
res.status(201).json(announcement);

    

  } catch (error) {
    console.log("🔥 ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= GET ALL ANNOUNCEMENTS =================
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 });

    res.status(200).json(announcements);

  } catch (error) {
    console.log("🔥 FETCH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= DELETE ANNOUNCEMENT =================
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({ msg: "Announcement not found" });
    }

    // 🔥 Socket emit
    const io = req.app.get("io");
    if (io) {
      io.emit("deleteAnnouncement", announcement._id);
    }

    res.json({ msg: "Deleted successfully" });

  } catch (error) {
    console.log("🔥 DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= EXPORT =================
module.exports = {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
};