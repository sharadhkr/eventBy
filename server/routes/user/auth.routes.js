const express = require("express");
const 
router = express.Router();

/* ===========================
   MIDDLEWARES
=========================== */
const verifyAuth = require("../../middlewares/firebase.middleware");
const upload = require("../../config/cloudinary");

/* ===========================
   CONTROLLERS
=========================== */
const authController = require("../../controllers/user/auth.controller");
const userController = require("../../controllers/user/user.controller");

console.log("FINAL CHECK:", {
  verifyAuth: typeof verifyAuth,
  loginOrRegister: typeof authController.loginOrRegister
});

/* ===========================
   AUTH
=========================== */
router.post(
  "/firebase",
  authController.loginOrRegister
);

router.post("/logout", verifyAuth,authController.logout);

/* ===========================
   PROFILE
=========================== */
router.get(
  "/profile",
  verifyAuth,
  userController.getProfile
);
// DASHBOARD
router.get(
  "/dashboard/events",
  verifyAuth,
  userController.getDashboardEvents
);

router.get(
  "/dashboard/recommended",
  verifyAuth,
  userController.getRecommendedEvents
);

router.get(
  "/dashboard/announcements",
  verifyAuth,
  userController.getDashboardAnnouncements
);

router.patch(
  "/update-profile",
  verifyAuth,
  upload.single("photo"),
  userController.updateProfile
);

router.patch(
  "/update-resume",
  verifyAuth,
  userController.updateResume
);


router.post(
  "/create-order/:eventId",
  verifyAuth,
  userController.createOrder
);

router.post(
  "/join-event/:eventId",
  verifyAuth,
  userController.joinEvent
);

router.get(
  "/events/:eventId/announcements",
  verifyAuth,
  userController.getAnnouncements
);

// Save / Unsave Event (Bookmark)
router.post(
  "/save-event/:eventId",
  verifyAuth,
  userController.toggleSaveEvent
);

// User Joined Events
router.get(
  "/my-events",
  verifyAuth,
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
router.get(
  "/home/details",verifyAuth,
  userController.getUserDashboardHome
)
// Top Organisers
router.get(
  "/organisers",
  userController.getTopOrganisers
);

module.exports = router;
