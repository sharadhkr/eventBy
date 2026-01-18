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
  broadcastAnnouncement,
  getDashboardStats,
  getEventDetails // Make sure this is imported!
} = require("../../controllers/event/controller");

/* =========================================================
   1. SPECIFIC STATIC ROUTES (Must come first)
========================================================= */
router.post("/", protectOrganiser, upload.single("banner"), createEvent);
router.get("/", protectOrganiser, getMyEvents);
router.get("/dashboard/stats", protectOrganiser, getDashboardStats);
router.post("/broadcast", protectOrganiser, broadcastAnnouncement);

/* =========================================================
   2. DYNAMIC ID ROUTES (Must come last)
========================================================= */
// Move these below the static routes to avoid "id" collisions
router.get("/:id", protectOrganiser, getEventDetails); 
router.put("/:id", protectOrganiser, upload.single("banner"), updateEvent);
router.delete("/:id", protectOrganiser, deleteEvent);
router.patch("/:id/status", protectOrganiser, toggleEventStatus);
router.get("/:id/analytics", protectOrganiser, getEventAnalytics);
router.post("/:id/announcements", protectOrganiser, postAnnouncement);
router.get("/:id/announcements", protectOrganiser, getAnnouncementsForOrganiser);

module.exports = router;
