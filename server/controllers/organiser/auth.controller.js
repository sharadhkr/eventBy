// server/controllers/organiser/auth.controller.js
const jwt = require("jsonwebtoken");
const Organiser = require("../../models/organiser.model");
const Announcement = require("../../models/annousmentmodel");
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

  // Remove password from output
  organiser.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: { organiser },
  });
};

exports.registerOrganiser = async (req, res) => {
  try {
    console.log("REGISTER HIT", req.body); // already logging
    const newOrganiser = await Organiser.create(req.body);
    createSendToken(newOrganiser, 201, res);
  } catch (err) {
    console.error("REGISTER ERROR 👉", err); // <--- Add this
    res.status(400).json({
      success: false,
      message: err.code === 11000 ? "Duplicate field value" : err.message,
    });
  }
};


exports.loginOrganiser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Provide email and password" });

    const organiser = await Organiser.findOne({ email }).select("+password");
    if (!organiser || !(await organiser.correctPassword(password))) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    organiser.lastLogin = Date.now();
    await organiser.save({ validateBeforeSave: false });

    createSendToken(organiser, 200, res);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logoutOrganiser = (req, res) => {
  res.clearCookie("organiser_token");
  res.status(200).json({ success: true, message: "Logged out" });
};
exports.createAnnouncement = async (req, res) => {
  const { eventId, teamId, message } = req.body;

  const ann = await Announcement.create({
    event: eventId,
    team: teamId || null,
    message,
    createdBy: req.organiser._id,
  });

  // Increment unread count
  await User.updateMany(
    { "joinedEvents.event": eventId },
    { $inc: { unreadAnnouncements: 1 } }
  );

  res.json({ success: true, data: ann });
};

exports.getMe = async (req, res) => {
  try {
    const organiser = await Organiser.findById(req.organiser.id).populate("followers", "name");
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

    const organiser = await Organiser.findByIdAndUpdate(req.organiser.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: organiser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};