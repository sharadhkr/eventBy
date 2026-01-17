const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      unique: true, // one group per event
    },
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organiser",
      required: true,
    },
    messages: {
      type: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "messages.senderType",
          },
          senderType: {
            type: String,
            enum: ["Organiser"],
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          isAnnouncement: {
            type: Boolean,
            default: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [], // 🔥 THIS FIXES YOUR ERROR
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnnouncementGroup", AnnouncementSchema);
