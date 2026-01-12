const Event = require("../models/Event.model");

exports.createEvent = async (req, res) => {
  const event = await Event.create({
    ...req.body,
    organiser: req.organiser._id,
    availableSeats: req.body.totalSeats,
  });

  res.json({ success: true, event });
};

exports.myEvents = async (req, res) => {
  const events = await Event.find({ organiser: req.organiser._id });
  res.json({ success: true, events });
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, organiser: req.organiser._id },
    req.body,
    { new: true }
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json({ success: true, event });
};
