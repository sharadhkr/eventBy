const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
} = require("../../controllers/admin/auth.controller");

const adminAuth = require("../../middlewares/admin/auth.middleware");

/* AUTH */
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

router.get("/me", adminAuth, getAdminProfile);

module.exports = router;
