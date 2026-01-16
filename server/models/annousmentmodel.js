const mongoose = require("mongoose");
const announcementSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
  message: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Organiser" },
}, { timestamps: true });

module.exports = mongoose.model("Announcement", announcementSchema);
