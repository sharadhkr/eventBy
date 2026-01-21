const TopEvent = require("../../models/Top.event");
const Event = require("../../models/Event.model");

/* =========================================================
   GET TOP EVENTS + ALL EVENTS (ADMIN)
========================================================= */
exports.getTopEvents = async (req, res) => {
  try {
    // 1️⃣ Top selected events (Top 1–3)
    const topEvents = await TopEvent.find()
      .populate({
        path: "event",
        select: "title banner status eventStart organiser",
        populate: {
          path: "organiser",
          select: "organisationName logo",
        },
      })
      .sort({ position: 1 })
      .lean();

    // 2️⃣ All published events (for dropdown)
    const allEvents = await Event.find({ status: "published" })
      .select("title banner status eventStart organiser")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        topEvents,
        allEvents,
      },
    });
  } catch (err) {
    console.error("ADMIN TOP EVENTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch top events" });
  }
};



/* =========================================================
   SET / REPLACE TOP EVENT
========================================================= */
exports.setTopEvent = async (req, res) => {
  try {
    const { eventId, position } = req.body;

    if (![1, 2, 3].includes(position)) {
      return res.status(400).json({ message: "Invalid position" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "published") {
      return res
        .status(400)
        .json({ message: "Only published events can be top events" });
    }

    // Remove existing event or position
    await TopEvent.deleteMany({
      $or: [{ event: eventId }, { position }],
    });

    const topEvent = await TopEvent.create({
      event: eventId,
      position,
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: `Event set as Top ${position}`,
      data: topEvent,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to set top event" });
  }
};

/* =========================================================
   REMOVE TOP EVENT
========================================================= */
exports.removeTopEvent = async (req, res) => {
  await TopEvent.deleteOne({ event: req.params.eventId });
  res.json({ success: true, message: "Top event removed" });
};
