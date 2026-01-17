const express = require("express");
const router = express.Router();
const upload = require("../../config/cloudinary");
const protectOrganiser = require("../../middlewares/organiser/auth.middleware");

const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  getEventAnalytics,
  postAnnouncement,
  getAnnouncementsForOrganiser,
} = require("../../controllers/event/controller");

// CRUD
router.post("/", protectOrganiser, upload.single("banner"), createEvent);
router.get("/", protectOrganiser, getMyEvents);
router.put("/:id", protectOrganiser, upload.single("banner"), updateEvent);
router.delete("/:id", protectOrganiser, deleteEvent);

// Extras
router.patch("/:id/status", protectOrganiser, toggleEventStatus);
router.get("/:id/analytics", protectOrganiser, getEventAnalytics);
router.post("/:id/announcements", protectOrganiser, postAnnouncement);
router.get("/:id/announcements", protectOrganiser, getAnnouncementsForOrganiser);

module.exports = router;
