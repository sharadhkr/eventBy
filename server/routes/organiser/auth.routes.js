// server/routes/organiser/auth.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../../config/cloudinary");

const {
  registerOrganiser,
  loginOrganiser,
  logoutOrganiser,
  getMe,
  updateProfile,
} = require("../../controllers/organiser/auth.controller");

const protectOrganiser = require("../../middlewares/organiser/auth.middleware");

router.post("/register", registerOrganiser);
router.post("/login", loginOrganiser);
router.post("/logout", protectOrganiser, logoutOrganiser);
router.get("/me", protectOrganiser, getMe);
router.put("/profile", protectOrganiser, upload.single("logo"), updateProfile);

module.exports = router;