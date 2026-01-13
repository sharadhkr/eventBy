const Event = require("../../models/Event.model");

/**
 * CREATE EVENT
 */
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      price,
      totalTickets,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,

      // 🔥 MAP CORRECTLY
      ticketPrice: Number(price),
      totalSeats: Number(totalTickets),

      organiser: req.organiser._id,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL EVENTS OF LOGGED-IN ORGANISER
 */
exports.getMyEvents = async (req, res) => {
  try {
    const organiserId = req.organiser.id;

    const events = await Event.find({ organiser: organiserId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

/**
 * UPDATE EVENT
 */
exports.updateEvent = async (req, res) => {
  try {
    const organiserId = req.organiser.id;
    const { id } = req.params;

    const event = await Event.findOneAndUpdate(
      { _id: id, organiser: organiserId },
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

/**
 * DELETE EVENT
 */
exports.deleteEvent = async (req, res) => {
  try {
    const organiserId = req.organiser.id;
    const { id } = req.params;

    const event = await Event.findOneAndDelete({
      _id: id,
      organiser: organiserId,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
