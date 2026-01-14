// server/controllers/event/controller.js
const Event = require("../../models/Event.model");

exports.createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body, organiser: req.organiser._id };
    if (req.file) eventData.banner = req.file.path;

    ["location", "winningPrize"].forEach((field) => {
      if (typeof eventData[field] === "string") eventData[field] = JSON.parse(eventData[field]);
    });

    const event = await Event.create(eventData);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error("Create Event Error:", err);
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organiser: req.organiser._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.banner = req.file.path;

    ["location", "winningPrize"].forEach((field) => {
      if (typeof updateData[field] === "string") updateData[field] = JSON.parse(updateData[field]);
    });

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organiser: req.organiser._id },
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, organiser: req.organiser._id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organiser: req.organiser._id }).populate("participants.user");
    if (!event) return res.status(404).json({ message: "Event not found" });

    const analytics = {
      participantsCount: event.participants.length,
      soldSeats: event.soldSeats,
      revenue: event.soldSeats * event.ticketPrice,
      // Add more metrics as needed
    };

    res.json({ success: true, data: analytics });
  } catch (err) {
    res.status(500).json({ message: "Analytics fetch failed" });
  }
};