const express = require("express");
const router = express.Router();

const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} = require("../../controllers/event/controller");

const organiserAuth = require("../../middlewares/organiser/auth.middleware");

// 🔐 All routes protected
router.post("/", organiserAuth, createEvent);
router.get("/", organiserAuth, getMyEvents);
router.put("/:id", organiserAuth, updateEvent);
router.delete("/:id", organiserAuth, deleteEvent);

module.exports = router;
