const Event = require("../../models/Event.model");
const AnnouncementGroup = require("../../models/Announcement.model");
const EventParticipation = require("../../models/Event.participation.model");
const Payment = require("../../models/Payment.model");
const EventPass = require("../../models/Event.pass.model");
const autoVerifyOrganiser = require("../../utils/autoVerifyOrganiser");
const Organiser = require("../../models/organiser.model");
/* ================= UTILS ================= */

const parseJsonFields = (data, fields) => {
  fields.forEach((field) => {
    if (typeof data[field] === "string") {
      try {
        data[field] = JSON.parse(data[field]);
      } catch { }
    }
  });
};
/* =========================================================
   1. CREATE EVENT (DEBUG & FIX VERSION)
========================================================= */
exports.createEvent = async (req, res) => {
  try {
    // 🔍 DEBUG 1: Log inputs to see if body/file is arriving
    console.log("----------------------------------------");
    console.log("🚀 START CREATE EVENT");
    console.log("User:", req.organiser ? req.organiser._id : "UNDEFINED");
    console.log("File:", req.file ? "Received" : "MISSING");
    // console.log("Body:", JSON.stringify(req.body, null, 2)); // Uncomment to see full body

    // 1. AUTH CHECK
    if (!req.organiser || !req.organiser._id) {
      throw new Error("Authentication Failed: req.organiser is missing.");
    }

    const eventData = {
      organiser: req.organiser._id,
      ...req.body,
    };

    /* ================= FILE HANDLING ================= */
    // Schema requires 'banner'. If file uploaded, use path.
    if (req.file) {
      eventData.banner = req.file.path;
    } else if (!eventData.banner) {
      // If no file AND no string URL provided -> Reject
      return res.status(400).json({ message: "Banner image is required" });
    }

    /* ================= SAFE JSON PARSING ================= */
    // Fixes "SyntaxError" if fields are already objects
    const parseSafe = (key) => {
      if (eventData[key] && typeof eventData[key] === "string") {
        try {
          eventData[key] = JSON.parse(eventData[key]);
        } catch (e) {
          console.error(`⚠️ Failed to parse field '${key}':`, e.message);
          // Don't crash, just leave it or set to empty object
          eventData[key] = {}; 
        }
      }
    };

    ["teamCriteria", "pricing", "rules", "venueDetails"].forEach(parseSafe);

    /* ================= BASIC VALIDATION ================= */
    const requiredFields = [
      "title",
      "description",
      "eventType",
      "registrationDeadline",
      "eventStart",
      "eventEnd",
      "mode",
    ];

    const missing = requiredFields.filter((field) => !eventData[field]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
    }

    /* ================= LOGIC: PARTICIPATION ================= */
    // Default to object if missing to prevent "cannot read properties of undefined"
    const criteria = eventData.teamCriteria || {};
    if (!criteria.type) {
      return res.status(400).json({ message: "Participation Type (solo/duo/squad) is required." });
    }

    eventData.participationType = criteria.type;
    const maxTeams = Number(criteria.maxTeamsAllowed) || 1;

    if (eventData.participationType === "solo") {
      eventData.maxParticipants = maxTeams;
      eventData.maxTeams = null;
    } else {
      const teamSize = eventData.participationType === "duo" ? 2 : 4;
      eventData.maxTeams = maxTeams;
      eventData.maxParticipants = maxTeams * teamSize;
    }

    /* ================= LOGIC: PRICING ================= */
    const pricing = eventData.pricing || {};
    eventData.isPaid = !pricing.isFree;
    eventData.price = eventData.isPaid ? Number(pricing.amount || 0) : 0;

    if (eventData.isPaid && eventData.price <= 0) {
      return res.status(400).json({ message: "Paid events must have a price > 0" });
    }

    /* ================= LOGIC: LOCATION & GEO ================= */
    if (eventData.mode === "offline") {
      // Ensure venueDetails exists
      if (!eventData.venueDetails || !eventData.venueDetails.addressLine1) {
        return res.status(400).json({ message: "Address is required for offline events" });
      }

      const lat = parseFloat(eventData.lat);
      const lng = parseFloat(eventData.lng);

      // Strict check for valid coordinates
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ message: "Invalid Coordinates" });
      }

      eventData.location = {
        address: eventData.venueDetails.addressLine1,
        city: eventData.venueDetails.city,
        state: eventData.venueDetails.state,
        country: eventData.venueDetails.country || "India",
      };

      // MONGO REQUIRES [lng, lat] ORDER
      eventData.geoLocation = {
        type: "Point",
        coordinates: [lng, lat],
      };
    } else {
      eventData.location = { address: "Online Event" };
      // Remove geoLocation to prevent "2dsphere" index errors on empty objects
      delete eventData.geoLocation;
    }

    /* ================= CLEANUP & SAVE ================= */
    eventData.status = "published";
    // Remove temporary fields that aren't in schema
    ["lat", "lng", "teamCriteria", "pricing", "venueDetails"].forEach(k => delete eventData[k]);

    const newEvent = await Event.create(eventData);

    // Only run this if Event creation succeeded
    try {
      await AnnouncementGroup.create({
        event: newEvent._id,
        organiser: req.organiser._id,
        messages: [
          {
            sender: req.organiser._id,
            senderType: "Organiser",
            content: "🎉 Event created successfully. Stay tuned for updates!",
            isAnnouncement: true,
          },
        ],
      });
    } catch (announcementErr) {
      console.error("Announcement Group Creation Failed (Non-fatal):", announcementErr.message);
    }

    console.log("✅ SUCCESS: Event Created", newEvent._id);
    res.status(201).json({ success: true, data: newEvent });

  } catch (err) {
    // 🔥 HERE IS THE FIX FOR [object Object]
    console.log("❌ CRITICAL ERROR LOG:");
    console.dir(err, { depth: null, colors: true }); // This expands the error fully

    // Mongoose Validation Error Handler
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    // Duplicate Key Error (e.g. unique title?)
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate field value entered" });
    }

    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
      // Optional: Send stack trace only in development
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
};


/* =========================================================
   2. GET MY EVENTS
========================================================= */
exports.getMyEvents = async (req, res) => {
  const events = await Event.find({ organiser: req.organiser._id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: events });
};
exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      organiser: req.organiser._id 
    }).lean();

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error retrieving event" });
  }
};

/* =========================================================
   3. UPDATE EVENT  ✅ (FIXED & EXISTS)
========================================================= */
exports.updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.banner = req.file.path;

    parseJsonFields(updateData, ["teamCriteria", "pricing", "rules", "venueDetails"]);

    if (updateData.mode === "offline" && updateData.lat && updateData.lng) {
      updateData.geoLocation = {
        type: "Point",
        coordinates: [Number(updateData.lng), Number(updateData.lat)],
      };
    }

    delete updateData.lat;
    delete updateData.lng;
    delete updateData.teamCriteria;
    delete updateData.pricing;
    delete updateData.venueDetails;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organiser: req.organiser._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =========================================================
   4. DELETE EVENT
========================================================= */
exports.deleteEvent = async (req, res) => {
  const event = await Event.findOneAndDelete({
    _id: req.params.id,
    organiser: req.organiser._id,
  });

  if (!event) return res.status(404).json({ message: "Event not found" });

  await Promise.all([
    AnnouncementGroup.deleteOne({ event: event._id }),
    EventParticipation.deleteMany({ event: event._id }),
    Payment.deleteMany({ event: event._id }),
    EventPass.deleteMany({ event: event._id }),
  ]);

  res.json({ success: true, message: "Event deleted completely" });
};

/* =========================================================
   5. STATUS
========================================================= */


exports.toggleEventStatus = async (req, res) => {
  const { status } = req.body;

  if (!["draft", "published", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, organiser: req.organiser._id },
    { status },
    { new: true }
  );

  if (!event) return res.status(404).json({ message: "Event not found" });

  // 🔥 AUTO-VERIFY LOGIC HERE
  if (status === "completed") {
    // 1️⃣ Increment organiser event count
    await Organiser.findByIdAndUpdate(
      event.organiser,
      { $inc: { totalEventsCreated: 1 } },
      { new: true }
    );

    // 2️⃣ Auto-verify if threshold met
    await autoVerifyOrganiser(event.organiser);
  }

  res.json({ success: true, status: event.status });
};


/* =========================================================
   6. ANNOUNCEMENTS
========================================================= */
exports.getAnnouncementsForOrganiser = async (req, res) => {
  const group = await AnnouncementGroup.findOne({
    event: req.params.id,
    organiser: req.organiser._id,
  }).lean();

  res.json({ success: true, data: group?.messages || [] });
};

exports.postAnnouncement = async (req, res) => {
  const { content } = req.body;
  if (!content?.trim()) {
    return res.status(400).json({ message: "Message required" });
  }

  await AnnouncementGroup.findOneAndUpdate(
    { event: req.params.id, organiser: req.organiser._id },
    {
      $push: {
        messages: {
          sender: req.organiser._id,
          senderType: "Organiser",
          content,
          isAnnouncement: true,
        },
      },
    }
  );

  res.status(201).json({ success: true });
};

/* =========================================================
   7. ANALYTICS
========================================================= */
exports.getEventAnalytics = async (req, res) => {
  const [participants, payments, passes] = await Promise.all([
    EventParticipation.countDocuments({ event: req.params.id }),
    Payment.find({ event: req.params.id, status: "paid" }),
    EventPass.countDocuments({ event: req.params.id }),
  ]);

  const revenue = payments.reduce((s, p) => s + p.amount, 0);

  res.json({
    success: true,
    data: { participants, passesIssued: passes, revenue },
  });
};
// New Global Stats with Unique User Counting
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Event.aggregate([
      // 1. Filter events belonging only to this organiser
      { $match: { organiser: req.organiser._id } },
      
      // 2. Calculate totals
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$price", "$participantsCount"] } },
          totalRegistrations: { $sum: "$participantsCount" },
          totalEvents: { $sum: 1 },
          activeEvents: { 
            $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] } 
          }
        }
      }
    ]);

    // Fallback if no events exist yet
    const result = stats.length > 0 ? stats[0] : {
      totalRevenue: 0,
      totalRegistrations: 0,
      totalEvents: 0,
      activeEvents: 0
    };

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ message: "Analytics sync failed", error: err.message });
  }
};


// Global Broadcast Logic
exports.broadcastAnnouncement = async (req, res) => {
  const { content } = req.body;
  try {
    const myEvents = await Event.find({ organiser: req.organiser._id }).select("_id");
    const eventIds = myEvents.map(e => e._id);

    // Bulk update all announcement groups for these events
    await AnnouncementGroup.updateMany(
      { event: { $in: eventIds } },
      { $push: { messages: {
          sender: req.organiser._id,
          senderType: "Organiser",
          content,
          isAnnouncement: true,
          createdAt: new Date()
      }}}
    );

    res.status(200).json({ success: true, message: "Broadcast sent to all events!" });
  } catch (err) {
    res.status(500).json({ message: "Broadcast failed" });
  }
};

/* =========================================================
   8. MAP EVENTS (PUBLIC)
========================================================= */
exports.getMapEvents = async (req, res) => {
  const events = await Event.find({
    status: "published",
    mode: "offline",
    geoLocation: { $exists: true },
  })
    .populate("organiser", "organisationName logo")
    .select("title banner geoLocation price isPaid")
    .lean();

  res.json({ success: true, data: events });
};
