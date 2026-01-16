const mongoose = require("mongoose");

const eventParticipationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null, // null = solo participant
    },

    role: {
      type: String,
      enum: ["leader", "member", "solo"],
      default: "solo",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate joins:
 * One user can join an event only once
 */
eventParticipationSchema.index(
  { event: 1, user: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "EventParticipation",
  eventParticipationSchema
);
