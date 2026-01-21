const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: [
        "ANNOUNCEMENT",
        "TEAM_INVITE",
        "TEAM_ACCEPTED",
        "EVENT_REMINDER",
        "EVENT_UPDATE"
      ],
      required: true
    },
    title: String,
    message: String,

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },

    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
