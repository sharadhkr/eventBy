const express = require("express");
const router = express.Router();

const {
  registerOrganiser,
  loginOrganiser,
  logoutOrganiser,
} = require("../../controllers/organiser/auth.controller");

const protectOrganiser = require("../../middlewares/organiser/auth.middleware");

router.post("/register", registerOrganiser);
router.post("/login", loginOrganiser);
router.post("/logout", logoutOrganiser);

/* test protected route */
router.get("/me", protectOrganiser, (req, res) => {
  res.json({ success: true, organiser: req.organiser });
});

module.exports = router;
