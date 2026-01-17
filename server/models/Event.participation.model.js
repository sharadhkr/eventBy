const mongoose = require("mongoose");

const EventParticipationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    team: {
      name: String,
      members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },

    isPaymentVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventParticipation", EventParticipationSchema);
