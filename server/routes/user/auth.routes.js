const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/user.controller");
const authController = require("../../controllers/user/auth.controller");
const firebaseMiddleware = require("../../middlewares/firebase.middleware");



router.post("/firebase", firebaseMiddleware.verifyFirebaseToken, authController.loginOrRegister);
// Profile Management
router.get("/profile", firebaseMiddleware.verifyFirebaseToken, userController.getProfile);
router.patch("/update-profile", firebaseMiddleware.verifyFirebaseToken, userController.updateProfile);

// Event Functionalities
router.post("/join-event/:eventId", firebaseMiddleware.verifyFirebaseToken, userController.joinEvent);
router.get("/my-events", firebaseMiddleware.verifyFirebaseToken, userController.getMyEvents);
router.get("/events", userController.getAllEvents)
// Professional / Resume
router.patch("/update-resume", firebaseMiddleware.verifyFirebaseToken, userController.updateResume);

module.exports = router;
