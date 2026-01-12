const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  price: Number,
  totalSeats: Number,
  availableSeats: Number,

  organiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organiser",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
