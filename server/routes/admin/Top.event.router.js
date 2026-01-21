const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/admin/auth.middleware");

const {
  getTopEvents,
  setTopEvent,
  removeTopEvent,
} = require("../../controllers/admin/topevent.controller");

/* ADMIN */
router.get("/", adminAuth, getTopEvents);
router.post("/", adminAuth, setTopEvent);
router.delete("/:eventId", adminAuth, removeTopEvent);

module.exports = router;
