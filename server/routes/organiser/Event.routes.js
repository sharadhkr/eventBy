// server/routes/organiser/Event.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../../config/cloudinary");

const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  toggleEventStatus, // 👈 ADD THIS
} = require("../../controllers/event/controller");

const protectOrganiser = require("../../middlewares/organiser/auth.middleware");

router.post("/", protectOrganiser, upload.single("banner"), createEvent);
router.get("/", protectOrganiser, getMyEvents);
router.put("/:id", protectOrganiser, upload.single("banner"), updateEvent);
router.delete("/:id", protectOrganiser, deleteEvent);
router.get("/:id/analytics", protectOrganiser, getEventAnalytics);

// ✅ NEW: Pause / Publish
router.patch("/:id/status", protectOrganiser, toggleEventStatus);

module.exports = router;
