const jwt = require("jsonwebtoken");
const Organiser = require("../../models/organiser.model");
const Announcement = require("../../models/Announcement.model.js");
const bcrypt = require("bcryptjs");

// Helper to generate and send Cookie/Token
const createSendToken = (organiser, statusCode, res) => {
  const token = jwt.sign({ id: organiser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("organiser_token", token, cookieOptions);

  organiser.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: { organiser },
  });
};

/* ================= REGISTER ================= */

exports.registerOrganiser = async (req, res) => {
  try {
    const newOrganiser = await Organiser.create(req.body);
    createSendToken(newOrganiser, 201, res);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.code === 11000 ? "Duplicate field value" : err.message,
    });
  }
};

/* ================= LOGIN (FIXED) ================= */

exports.loginOrganiser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Provide email and password" });
    }

    const organiser = await Organiser.findOne({ email }).select("+password");

    if (!organiser || !(await organiser.correctPassword(password))) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    // 🔒🔥 CRITICAL FIX — BLOCK DISABLED ORGANISER HERE
    if (!organiser.isActive) {
      return res.status(403).json({
        message: "Your organiser account has been disabled by admin",
      });
    }

    organiser.lastLogin = Date.now();
    await organiser.save({ validateBeforeSave: false });

    createSendToken(organiser, 200, res);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGOUT ================= */

exports.logoutOrganiser = (req, res) => {
  res.clearCookie("organiser_token");
  res.status(200).json({ success: true, message: "Logged out" });
};

/* ================= PROFILE ================= */

exports.getMe = async (req, res) => {
  try {
    const organiser = await Organiser.findById(req.organiser.id).populate(
      "followers",
      "name"
    );
    res.json({ success: true, data: organiser });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.logo = req.file.path;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const organiser = await Organiser.findByIdAndUpdate(
      req.organiser.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: organiser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
