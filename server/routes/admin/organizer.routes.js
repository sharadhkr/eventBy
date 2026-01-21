const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/admin/auth.middleware");
const {
  getAllOrganisers,
  toggleOrganiserStatus,
  toggleOrganiserVerification,
} = require("../../controllers/admin/organiser.controller");

router.get("/", adminAuth, getAllOrganisers);
router.patch("/:id/status", adminAuth, toggleOrganiserStatus);
router.patch("/:id/verify", adminAuth, toggleOrganiserVerification);

module.exports = router;
