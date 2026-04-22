const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getComplaints,
  updateStatus,
} = require("../controllers/complaintController");

const { protect, authorize } = require("../middleware/authMiddleware");

// 👤 Resident → Create
router.post("/", protect, authorize("resident"), createComplaint);

// 👥 All logged users → View
router.get("/", protect, getComplaints);

// 👑 Admin → Update status
router.put("/:id", protect, authorize("admin"), updateStatus);

module.exports = router;