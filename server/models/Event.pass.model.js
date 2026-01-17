const mongoose = require("mongoose");

const EventPassSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    passId: { type: String, unique: true },
    qrData: String,

    isCheckedIn: { type: Boolean, default: false },
    checkedInAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventPass", EventPassSchema);
