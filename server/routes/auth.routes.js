const router = require("express").Router();
const authController = require("../controllers/user/auth.controller");
const firebaseMiddleware = require("../middlewares/firebase.middleware");


router.post("/firebase", firebaseMiddleware.verifyFirebaseToken, authController.loginOrRegister);

module.exports = router;