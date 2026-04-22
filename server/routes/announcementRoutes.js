const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const { protect, authorize } = require("../middleware/authMiddleware");

// 🔥 ADD DEBUG HERE
console.log("createAnnouncement:", createAnnouncement);
console.log("getAnnouncements:", getAnnouncements);
console.log("deleteAnnouncement:", deleteAnnouncement);
console.log("protect:", protect);
console.log("authorize:", authorize);

// 👑 ADMIN ONLY → CREATE
router.post("/", protect, authorize("admin"), createAnnouncement);

// 👥 ALL USERS → VIEW
router.get(
  "/",
  protect,
  authorize("admin", "resident", "security"),
  getAnnouncements
);

// 👑 ADMIN ONLY → DELETE
router.delete("/:id", protect, authorize("admin"), deleteAnnouncement);

module.exports = router;