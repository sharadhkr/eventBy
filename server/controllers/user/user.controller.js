const User = require("../../models/User.model");
const Event = require("../../models/Event.model");
const Organiser = require("../../models/organiser.model");
const EventParticipation = require("../../models/Eventparticipationmodel");

/* ============================================================
   PROFILE
============================================================ */

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })
      .populate("savedEvents", "title banner eventDate")
      .populate("groups.team")
      .populate("groups.event");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("getProfile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// PATCH /api/users/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { displayName, skills, portfolio } = req.body;

    if (displayName !== undefined) user.displayName = displayName;

    if (skills) {
      user.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
    }

    if (portfolio) {
      const parsed =
        typeof portfolio === "string" ? JSON.parse(portfolio) : portfolio;
      user.portfolio = { ...user.portfolio, ...parsed };
    }

    // multer + cloudinary-storage gives URL directly
    if (req.file) {
      user.photoURL = req.file.path;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: user,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    res.status(400).json({ message: error.message });
  }
};

/* ============================================================
   EVENT JOIN (SOLO ONLY FOR NOW, TEAM READY)
============================================================ */

// POST /api/users/join-event/:eventId
exports.joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const [event, user] = await Promise.all([
      Event.findById(eventId),
      User.findOne({ uid: req.user.uid }),
    ]);

    if (!event) return res.status(404).json({ message: "Event not found" });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Already joined?
    const alreadyJoined = await EventParticipation.findOne({
      event: eventId,
      user: user._id,
    });

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already joined this event" });
    }

    // Capacity check
    if (event.totalCapacity && event.soldSeats >= event.totalCapacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Deadline check
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      return res
        .status(400)
        .json({ message: "Registration deadline passed" });
    }

    // Create participation (SOLO)
    await EventParticipation.create({
      event: event._id,
      user: user._id,
      role: "solo",
    });

    // Update event seats
    event.soldSeats += 1;
    await event.save();

    // Lightweight user tracking (for dashboard)
    user.joinedEvents.push({
      event: event._id,
      joinedAt: new Date(),
      mode: "solo",
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: "Successfully joined event",
    });
  } catch (error) {
    console.error("joinEvent error:", error);
    res.status(500).json({ message: "Failed to join event" });
  }
};

/* ============================================================
   EVENTS
============================================================ */

// GET /api/users/events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "published" })
      .populate("organiser", "organisationName logo")
      .sort({ eventDate: 1 });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("getAllEvents error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/my-events
exports.getMyEvents = async (req, res) => {
  try {
    const participations = await EventParticipation.find({
      user: req.user._id,
    })
      .populate("event")
      .populate("team");

    res.status(200).json({
      success: true,
      count: participations.length,
      data: participations,
    });
  } catch (error) {
    console.error("getMyEvents error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   SAVE / BOOKMARK EVENT
============================================================ */

// POST /api/users/save-event/:eventId
exports.toggleSaveEvent = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const { eventId } = req.params;
    const alreadySaved = user.savedEvents.includes(eventId);

    if (alreadySaved) {
      user.savedEvents.pull(eventId);
    } else {
      user.savedEvents.push(eventId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      saved: !alreadySaved,
    });
  } catch (error) {
    console.error("toggleSaveEvent error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ============================================================
   ORGANISERS
============================================================ */

// GET /api/users/organisers
exports.getTopOrganisers = async (req, res) => {
  try {
    const organisers = await Organiser.find({})
      .select("organisationName logo bio followerCount")
      .sort({ followerCount: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: organisers.length,
      data: organisers,
    });
  } catch (error) {
    console.error("getTopOrganisers error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateResume = async (req, res) => {
  try {
    const { url, public_id } = req.body;
    const user = await User.findOneAndUpdate(
      { uid: req.user.uid },
      { resume: { url, public_id, updatedAt: Date.now() } },
      { new: true }
    );
    res.status(200).json({ message: "Resume updated", resume: user.resume });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
