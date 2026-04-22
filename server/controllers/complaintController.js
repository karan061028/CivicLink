const Complaint = require("../models/Complaint");

// 🟢 CREATE COMPLAINT (Resident)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      priority,
      createdBy: req.user._id,
flatNumber: req.user.flatNumber
    });
    const Notification = require("../models/Notification");

const notif = await Notification.create({
  text: `🛠 Complaint: ${complaint.title}`,
  type: "complaint"
});

global.io.emit("newNotification", notif);

    res.status(201).json(complaint);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET COMPLAINTS
exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === "admin") {
      complaints = await Complaint.find()
        .populate("createdBy", "name email flatNumber");
    } else {
      complaints = await Complaint.find({ createdBy: req.user._id })
        .populate("createdBy", "name email flatNumber");
    }
    console.log(complaints[0]);

    res.json(complaints);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 UPDATE STATUS (Admin only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // 🔥 ADD THIS (MOST IMPORTANT)
    const io = req.app.get("io");
    if (io) {
      io.emit("complaint:update", complaint);
    }

    res.json(complaint);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};