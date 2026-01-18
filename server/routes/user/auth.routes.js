const express = require("express");
const router = express.Router();

/* ===========================
   MIDDLEWARES
=========================== */
const {verifyFirebaseToken} = require("../../middlewares/firebase.middleware");
const upload = require("../../config/cloudinary");

/* ===========================
   CONTROLLERS
=========================== */
const authController = require("../../controllers/user/auth.controller");
const userController = require("../../controllers/user/user.controller");

console.log("FINAL CHECK:", {
  verifyFirebaseToken: typeof verifyFirebaseToken,
  loginOrRegister: typeof authController.loginOrRegister
});

/* ===========================
   AUTH
=========================== */
router.post(
  "/firebase",
  authController.loginOrRegister
);

router.post("/logout", authController.logout);

/* ===========================
   PROFILE
=========================== */
router.get(
  "/profile",
  verifyFirebaseToken,
  userController.getProfile
);

router.patch(
  "/update-profile",
  verifyFirebaseToken,
  upload.single("photo"),
  userController.updateProfile
);

router.patch(
  "/update-resume",
  verifyFirebaseToken,
  userController.updateResume
);

/* ===========================
   PAYMENTS & EVENTS
=========================== */

// Create Razorpay Order (PAID EVENTS)
router.post(
  "/create-order/:eventId",
  verifyFirebaseToken,
  userController.createOrder
);

// Join Event (Free / Paid / Team)
router.post(
  "/join-event/:eventId",
  verifyFirebaseToken,
  userController.joinEvent
);

// Get Announcements (Joined users only)
router.get(
  "/events/:eventId/announcements",
  verifyFirebaseToken,
  userController.getAnnouncements
);

// Save / Unsave Event (Bookmark)
router.post(
  "/save-event/:eventId",
  verifyFirebaseToken,
  userController.toggleSaveEvent
);

// User Joined Events
router.get(
  "/my-events",
  verifyFirebaseToken,
  userController.getMyEvents
);

/* ===========================
   EVENTS (PUBLIC)
=========================== */

// Single Event Details
router.get(
  "/events/:id",
  userController.getEventDetails
);

// All Published Events
router.get(
  "/events",
  userController.getAllEvents
);

/* ===========================
   ORGANISERS
=========================== */

// Top Organisers
router.get(
  "/organisers",
  userController.getTopOrganisers
);

module.exports = router;
