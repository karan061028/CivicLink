const Visitor = require("../models/Visitor");

// 🟢 ADD VISITOR
exports.addVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, flatNumber } = req.body;

    if (!name || !phone || !flatNumber) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const visitor = await Visitor.create({
      name,
      phone,
      purpose,
      flatNumber,
      status: "pending",
      entryTime: new Date(),
    });
    const Notification = require("../models/Notification");

const notif = await Notification.create({
  text: `🚶 Visitor ${visitor.name} arrived`,
  type: "visitor"
});

global.io.emit("newNotification", notif);

    // 🔥 REAL-TIME EMIT
    const io = req.app.get("io");
    if (io) {
      io.emit("visitor:new", visitor);
    }

    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 GET VISITORS
exports.getVisitors = async (req, res) => {
  try {
    console.log("USER:", req.user); // 🔍 DEBUG

    let visitors;

    // 🛑 SAFETY CHECK (THIS FIXES 500 ERROR)
    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // 👑 ADMIN → ALL
    if (req.user.role === "admin") {
      visitors = await Visitor.find().sort({ createdAt: -1 });
    } 
    // 👤 RESIDENT → ONLY THEIR FLAT
    else {
      visitors = await Visitor.find({
        flatNumber: req.user.flatNumber || "INVALID", // 🛑 prevents crash
      }).sort({ createdAt: -1 });
    }

    res.json(visitors);

  } catch (error) {
    console.error("GET VISITOR ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
// 🟢 UPDATE VISITOR (APPROVE / REJECT)
exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    const Notification = require("../models/Notification");

try {
  const Notification = require("../models/Notification");

  const notif = await Notification.create({
    text: `🚶 Visitor ${req.body.status}`,
    type: "visitor"
  });

  if (global.io) {
    global.io.emit("newNotification", notif);
  }

} catch (err) {
  console.log("Notification error:", err.message);
}

    if (!visitor) {
      return res.status(404).json({ msg: "Visitor not found" });
    }

    const io = req.app.get("io");

    if (io) {
      io.emit("visitor:update", visitor);
    }

    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 EXIT VISITOR
exports.exitVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { exitTime: new Date() },
      { new: true }
    );

    const io = req.app.get("io");

    if (io) {
      io.emit("visitor:exit", visitor);
    }

    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🟢 DELETE VISITOR
exports.deleteVisitor = async (req, res) => {
  try {
    const deleted = await Visitor.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");

    if (io) {
      io.emit("visitor:delete", deleted?._id);
    }

    res.json({ msg: "Visitor deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
