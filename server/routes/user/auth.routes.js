const express = require("express");
const router = express.Router();

/* ===========================
   MIDDLEWARES
=========================== */
const firebaseMiddleware = require("../../middlewares/firebase.middleware");
const upload = require("../../config/cloudinary");

/* ===========================
   CONTROLLERS
=========================== */
const authController = require("../../controllers/user/auth.controller");
const userController = require("../../controllers/user/user.controller");
const teamController = require("../../controllers/user/Teamcontroller");

/* ============================================================
   AUTH (Firebase → Backend Sync)
============================================================ */
router.post(
  "/firebase",
  firebaseMiddleware.verifyFirebaseToken,
  authController.loginOrRegister
);

/* ============================================================
   PROFILE
============================================================ */
router.get(
  "/profile",
  firebaseMiddleware.verifyFirebaseToken,
  userController.getProfile
);

router.patch(
  "/update-profile",
  firebaseMiddleware.verifyFirebaseToken,
  upload.single("photo"), // Cloudinary + Multer
  userController.updateProfile
);

router.patch(
  "/update-resume",
  firebaseMiddleware.verifyFirebaseToken,
  userController.updateResume
);

/* ============================================================
   TEAM / GROUP MANAGEMENT
============================================================ */
router.post(
  "/teams/:teamId/invite",
  firebaseMiddleware.verifyFirebaseToken,
  teamController.inviteToTeam
);

router.post(
  "/teams/:teamId/accept",
  firebaseMiddleware.verifyFirebaseToken,
  teamController.acceptTeamInvite
);

router.post(
  "/teams/:teamId/reject",
  firebaseMiddleware.verifyFirebaseToken,
  teamController.rejectTeamInvite
);

/* ============================================================
   EVENTS (USER ACTIONS)
============================================================ */

// Join event (solo or team handled inside controller)
router.post(
  "/join-event/:eventId",
  firebaseMiddleware.verifyFirebaseToken,
  userController.joinEvent
);

router.post("/logout", authController.logout); 
// Save / Unsave event (Bookmark)
router.post(
  "/save-event/:eventId",
  firebaseMiddleware.verifyFirebaseToken,
  userController.toggleSaveEvent
);

// User joined events
router.get(
  "/my-events",
  firebaseMiddleware.verifyFirebaseToken,
  userController.getMyEvents
);

/* ============================================================
   PUBLIC DATA
============================================================ */

// All published events
router.get("/events", userController.getAllEvents);

// Top organisers
router.get("/organisers", userController.getTopOrganisers);

module.exports = router;
