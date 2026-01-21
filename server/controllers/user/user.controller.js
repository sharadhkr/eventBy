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

const mongoose = require("mongoose");
const TopEvent = require("../../models/Top.event");

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

    // 1. PRE-CHECK: If user is already in, stop
    const exists = await EventParticipation.findOne({ event: eventId, user: user._id });
    if (exists) return res.status(400).json({ message: "You have already joined this event" });

    // 2. PAYMENT VERIFICATION (Only needs to happen once for the whole team)
    if (event.isPaid) {
      // ... (Keep your existing Razorpay HMAC verification logic here) ...
      // If verification fails, return res.status(400)
    }

    // 3. COLLECTIVE JOINING LOGIC
    let membersToJoin = [user._id]; // Default to just the current user

    if (event.participationType !== "solo" && teamId) {
      const team = await Team.findById(teamId).populate("members.user");
      if (!team) return res.status(404).json({ message: "Team not found" });

      // Extract all member IDs from the team
      membersToJoin = team.members.map(m => m.user._id || m.user);
    }

    // 4. LOOP THROUGH ALL MEMBERS & CREATE DATA
    const joinPromises = membersToJoin.map(async (memberId) => {
      // Avoid duplicate check for teammates (if they joined via another team)
      const alreadyJoined = await EventParticipation.findOne({ event: eventId, user: memberId });
      if (alreadyJoined) return null;

      // A. Create Participation
      await EventParticipation.create({
        event: eventId,
        user: memberId,
        team: teamId || null,
        isPaymentVerified: true
      });

      // B. Update User Profile Array (for Dashboard visibility)
      await User.findByIdAndUpdate(memberId, { 
        $push: { 
          joinedEvents: { 
            event: eventId, 
            joinedAt: new Date(),
            mode: teamId ? "team" : "solo" 
          } 
        } 
      });

      // C. Generate Individual Pass
      const { passId, qrData } = generatePass(eventId, memberId);
      return await EventPass.create({
        event: eventId,
        user: memberId,
        passId,
        qrData
      });
    });

    const results = await Promise.all(joinPromises);
    const myPass = results.find(p => p && p.user.toString() === user._id.toString());

    // 5. UPDATE EVENT STATS (Increment by number of members joined)
    await Event.findByIdAndUpdate(eventId, { 
      $inc: { participantsCount: membersToJoin.length, soldSeats: 1 } 
    });

    res.status(200).json({ 
      success: true, 
      message: `Team joined! ${membersToJoin.length} passes issued.`, 
      pass: myPass 
    });

  } catch (err) {
    console.error("COLLECTIVE JOIN ERROR:", err);
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
    const events = await Event.aggregate([
      {
        $match: { status: "published" }
      },
      {
        $lookup: {
          from: "organisers",
          localField: "organiser",
          foreignField: "_id",
          as: "organiser"
        }
      },
      { $unwind: "$organiser" },

      // 🔒 FILTER ONLY ACTIVE ORGANISERS
      {
        $match: {
          "organiser.isActive": true
        }
      },

      {
        $project: {
          title: 1,
          banner: 1,
          eventStart: 1,
          mode: 1,
          location: 1,
          price: 1,
          isPaid: 1,
          organiser: {
            organisationName: 1,
            logo: 1
          }
        }
      },
      { $sort: { eventStart: 1 } }
    ]);

    const normalized = events.map(e => ({
      ...e,
      displayLocation:
        e.mode === "offline"
          ? `${e.location.city}, ${e.location.state}`
          : "Online Event",
      date: e.eventStart,
      price: e.price || 0
    }));

    res.json({ success: true, data: normalized });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events"
    });
  }
};



const getEventDetails = async (req, res) => {
  const event = await Event.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "organisers",
        localField: "organiser",
        foreignField: "_id",
        as: "organiser"
      }
    },
    { $unwind: "$organiser" },

    // 🔒 BLOCK INACTIVE ORGANISERS
    {
      $match: {
        "organiser.isActive": true
      }
    }
  ]);

  if (!event.length) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json({ success: true, data: event[0] });
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
  try {
    const organisers = await Organiser.aggregate([
      {
        // ✅ Treat true, "true", 1 as active
        $match: {
          $or: [
            { isActive: true },
            { isActive: "true" },
            { isActive: 1 }
          ]
        }
      },
      {
        $addFields: {
          followerCount: {
            $size: { $ifNull: ["$followers", []] }
          }
        }
      },
      {
        $sort: { followerCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          organisationName: 1,
          logo: 1,
          bio: 1,
          followerCount: 1,
          isActive: 1
        }
      }
    ]);

    res.status(200).json({ success: true, data: organisers });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch top organisers",
    });
  }
};

const getDashboardAnnouncements = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });

    const participations = await EventParticipation.find({ user: user._id })
      .select("event")
      .lean();

    const eventIds = participations.map(p => p.event);

    const groups = await Announcement.find({
      event: { $in: eventIds }
    })
      .populate("event", "title banner")
      .sort({ updatedAt: -1 })
      .lean();

    const feed = groups.flatMap(group =>
      group.messages.map(msg => ({
        ...msg,
        event: group.event
      }))
    );

    res.json({ success: true, data: feed });
  } catch (err) {
    console.error("Announcement Feed Error:", err);
    res.status(500).json({ message: "Failed to load announcements" });
  }
};
const getRecommendedEvents = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid }).lean();

    const joined = await EventParticipation.find({ user: user._id })
      .select("event")
      .lean();

    const joinedIds = joined.map(j => j.event);

    const events = await Event.aggregate([
      {
        $match: {
          status: "published",
          _id: { $nin: joinedIds },
          eventType: { $in: user.skills || [] }
        }
      },
      {
        $lookup: {
          from: "organisers",
          localField: "organiser",
          foreignField: "_id",
          as: "organiser"
        }
      },
      { $unwind: "$organiser" },
      {
        $match: {
          "organiser.isActive": true
        }
      },
      { $limit: 10 }
    ]);

    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
};

const getDashboardEvents = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });

    const participations = await EventParticipation.find({ user: user._id })
      .populate({
        path: "event",
        populate: { path: "organiser", select: "organisationName logo" }
      })
      .populate("team")
      .lean();

    const eventIds = participations.map(p => p.event?._id);

    const passes = await EventPass.find({
      user: user._id,
      event: { $in: eventIds }
    }).lean();

    const passMap = {};
    passes.forEach(p => {
      passMap[p.event.toString()] = p;
    });

    const enriched = participations.map(p => ({
      ...p,
      pass: passMap[p.event._id.toString()] || null
    }));

    res.json({ success: true, data: enriched });
  } catch (err) {
    console.error("Dashboard Events Error:", err);
    res.status(500).json({ message: "Failed to load dashboard events" });
  }
};
// controllers/user/dashboard.controller.js
const getUserDashboardHome = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const participations = await EventParticipation.find({ user: user._id })
      .populate({
        path: "event",
        populate: {
          path: "organiser",
          select: "organisationName logo isActive"
        }
      })
      .populate("team")
      .lean();

    const now = new Date();

    const joinedEvents = await Promise.all(
      participations.map(async (p) => {
        if (!p.event || !p.event.organiser?.isActive) return null;

        const start = new Date(p.event.eventStart);
        const diffMs = start - now;

        const timeRemaining =
          diffMs <= 0
            ? "Started"
            : {
                days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diffMs / (1000 * 60)) % 60),
              };

        const pass = await EventPass.findOne({
          user: user._id,
          event: p.event._id,
        }).lean();

        return {
          ...p,
          timeRemaining,
          pass,
        };
      })
    );

    /* ===============================
       ADMIN TOP EVENTS
    =============================== */
    const topEvents = await TopEvent.find({ active: true })
      .sort({ position: 1 })
      .populate({
        path: "event",
        match: { status: "published" },
        populate: {
          path: "organiser",
          select: "organisationName logo isActive",
        },
      })
      .lean();

    const filteredTopEvents = topEvents
      .filter(t => t.event && t.event.organiser?.isActive)
      .map(t => ({
        position: t.position,
        event: t.event
      }));

    res.json({
      success: true,
      data: {
        joinedEvents: joinedEvents.filter(Boolean),
        topEvents: filteredTopEvents
      }
    });

  } catch (err) {
    console.error("Dashboard Home Error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
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
  getDashboardEvents,getUserDashboardHome,
  getRecommendedEvents,
  getDashboardAnnouncements,
  getTopOrganisers
};
