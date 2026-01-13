const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organiser",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    banner: {
      type: String, // Cloudinary / image URL
    },

    ticketPrice: {
      type: Number,
      required: true,
    },

    totalSeats: {
      type: Number,
      required: true,
    },

    soldSeats: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
