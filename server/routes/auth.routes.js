const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const firebaseMiddleware = require("../middlewares/firebase.middleware");

// 🔍 DEBUG LOGS - Check your terminal for these!
console.log("Is loginOrRegister a function?", typeof authController.loginOrRegister);
console.log("Is verifyFirebaseToken a function?", typeof firebaseMiddleware.verifyFirebaseToken);

// This is where the crash happens if either is undefined
router.post("/firebase", firebaseMiddleware.verifyFirebaseToken, authController.loginOrRegister);

module.exports = router;