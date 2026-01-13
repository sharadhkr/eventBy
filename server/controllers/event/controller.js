const Event = require("../../models/Event.model");

/**
 * CREATE EVENT
 */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      registrationDeadline,
      location, // Should be { address: String, coordinates: [lon, lat] }
      ticketPrice,
      totalCapacity,
      mode,
      minGroupSize,
      maxGroupSize,
      banner,
      winningPrize
    } = req.body;

    // Use req.organiser._id from your organiser auth middleware
    const event = await Event.create({
      organiser: req.organiser._id,
      title,
      description,
      eventDate,
      registrationDeadline,
      location,
      ticketPrice: Number(ticketPrice),
      totalCapacity: Number(totalCapacity),
      mode,
      minGroupSize,
      maxGroupSize,
      banner,
      winningPrize,
      status: "published" // Or "draft" based on your UI logic
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * GET ALL EVENTS (Public - For AnalogDatePicker)
 */
exports.getAllEvents = async (req, res) => {
  try {
    // Only fetch published events for the public feed
    const events = await Event.find({ status: "published" })
      .populate("organiser", "organisationName logo")
      .sort({ eventDate: 1 }); // Sort by date ascending for the picker

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET ALL EVENTS OF LOGGED-IN ORGANISER
 */
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organiser: req.organiser._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch your events" });
  }
};

/**
 * UPDATE EVENT
 */
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure only the owner can update their specific event
    const event = await Event.findOneAndUpdate(
      { _id: id, organiser: req.organiser._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found or unauthorized" });
    }

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * DELETE EVENT
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOneAndDelete({
      _id: id,
      organiser: req.organiser._id,
    });

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
