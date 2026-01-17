const User = require("../../models/User.model");
const Event = require("../../models/Event.model");
const Organiser = require("../../models/organiser.model");
const EventParticipation = require("../../models/Event.participation.model");
const Team = require("../../models/team.model");
const Announcement = require("../../models/Announcement.model");
const Payment = require("../../models/Payment.model");
const EventPass = require("../../models/Event.pass.model");
const razorpay = require("../../config/rajorpay");
const crypto = require("crypto");
const generatePass = require("../../utils/Genrate.pass");

/* ============================================================
   PROFILE
============================================================ */

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).populate("savedEvents");
    if (!user) return res.status(404).json({ message: "User not found" });

    const teams = await Team.find({
      $or: [{ leader: user._id }, { "members.user": user._id }]
    })
      .populate("leader", "displayName photoURL")
      .populate("members.user", "displayName photoURL");

    res.json({ success: true, data: { ...user.toObject(), teams } });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { displayName, skills, portfolio } = req.body;

    if (displayName) user.displayName = displayName;
    if (skills) user.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
    if (portfolio) user.portfolio = typeof portfolio === "string" ? JSON.parse(portfolio) : portfolio;
    if (req.file) user.photoURL = req.file.path;

    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateResume = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      {
        resume: {
          url: req.body.url,
          public_id: req.body.public_id,
          updatedAt: Date.now()
        }
      },
      { new: true }
    );

    res.json({ success: true, resume: user.resume });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ============================================================
   PAYMENT
============================================================ */

const createOrder = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.pricing.isFree) {
      return res.json({ success: true, free: true });
    }

    const order = await razorpay.orders.create({
      amount: event.pricing.amount * 100,
      currency: event.pricing.currency || "INR",
      receipt: `evt_${event._id}_${Date.now()}`
    });

    await Payment.create({
      user: req.user._id,
      event: event._id,
      amount: event.pricing.amount,
      razorpayOrderId: order.id
    });

    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* ============================================================
   JOIN EVENT
============================================================ */

const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { teamId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const user = await User.findOne({ uid: req.user.uid });
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: "Event not found" });

    const exists = await EventParticipation.findOne({ event: eventId, user: user._id });
    if (exists) return res.status(400).json({ message: "Already joined" });

    if (event.teamCriteria.type !== "solo" && !teamId) {
      return res.status(400).json({ message: "Team required" });
    }

    if (!event.pricing.isFree) {
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (!payment) return res.status(400).json({ message: "Payment record missing" });

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expected = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expected !== razorpay_signature)
        return res.status(400).json({ message: "Payment verification failed" });

      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = "paid";
      await payment.save();
    }

    await EventParticipation.create({
      event: eventId,
      user: user._id,
      team: teamId || null,
      isPaymentVerified: true
    });

    const { passId, qrData } = generatePass(eventId, user._id);

    const pass = await EventPass.create({
      event: eventId,
      user: user._id,
      passId,
      qrData
    });

    await Event.findByIdAndUpdate(eventId, { $inc: { soldSeats: 1 } });

    res.json({ success: true, message: "Joined successfully", pass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   EVENTS & ANNOUNCEMENTS
============================================================ */

const getAnnouncements = async (req, res) => {
  const user = await User.findOne({ uid: req.user.uid });
  const joined = await EventParticipation.findOne({ event: req.params.eventId, user: user._id });

  if (!joined) return res.status(403).json({ message: "Join event first" });

  const announcements = await Announcement.find({ event: req.params.eventId }).sort({ createdAt: -1 });
  res.json({ success: true, data: announcements });
};

const getMyEvents = async (req, res) => {
  const user = await User.findOne({ uid: req.user.uid });
  const participations = await EventParticipation.find({ user: user._id })
    .populate("event")
    .populate("team");

  res.json({ success: true, data: participations });
};
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "published" })
      .populate("organiser", "organisationName logo")
      .sort({ eventStart: 1 })
      .lean();

    const normalized = events.map(e => ({
      ...e,
      // Use the actual 'location' object created during Event.create
      displayLocation: e.mode === "offline" 
        ? `${e.location.city}, ${e.location.state}` 
        : "Online Event",
      
      // Ensure date is consistent for frontend sorting
      date: e.eventStart,
      
      // Fallback for safety
      price: e.price || 0
    }));

    res.json({ success: true, data: normalized });
  } catch (err) {
    console.error("Fetch Events Error:");
    console.dir(err, { depth: null });
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};


const getEventDetails = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("organiser", "organisationName logo bio");

  if (!event) return res.status(404).json({ message: "Event not found" });

  res.json({ success: true, data: event });
};

const toggleSaveEvent = async (req, res) => {
  const user = await User.findOne({ uid: req.user.uid });
  const { eventId } = req.params;

  const saved = user.savedEvents.includes(eventId);
  saved ? user.savedEvents.pull(eventId) : user.savedEvents.push(eventId);

  await user.save();
  res.json({ success: true, saved: !saved });
};

const getTopOrganisers = async (req, res) => {
  const organisers = await Organiser.find({})
    .select("organisationName logo bio followerCount")
    .sort({ followerCount: -1 })
    .limit(10);

  res.json({ success: true, data: organisers });
};

/* ============================================================
   EXPORTS (SINGLE SOURCE OF TRUTH)
============================================================ */

module.exports = {
  getProfile,
  updateProfile,
  updateResume,
  createOrder,
  joinEvent,
  getAnnouncements,
  getMyEvents,
  getEventDetails,
  toggleSaveEvent,
  getAllEvents,
  getTopOrganisers
};
