const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organiser",
      required: true,
    },

    /* ================= BASIC INFO ================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      enum: ["hackathon", "workshop", "expert-talk", "competition", "meetup"],
      required: true,
    },

    rules: {
      type: [String],
      default: [],
    },

    banner: {
      type: String,
      required: true,
    },

    /* ================= DATES ================= */

    registrationDeadline: {
      type: Date,
      required: true,
    },

    eventStart: {
      type: Date,
      required: true,
    },

    eventEnd: {
      type: Date,
      required: true,
    },

    /* ================= PARTICIPATION ================= */

    participationType: {
      type: String,
      enum: ["solo", "duo", "squad"],
      required: true,
    },

    maxParticipants: {
      type: Number,
      required: true,
    },

    maxTeams: {
      type: Number,
      default: null,
    },

    /* ================= PRICING ================= */

    isPaid: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 0,
    },

    revenue: {
      type: Number,
      default: 0,
    },

    /* ================= MODE ================= */

    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    /* ================= LOCATION (HUMAN READABLE) ================= */

    location: {
      address: {
        type: String,
        required: function () {
          return this.mode === "offline";
        },
      },
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },

    /* ================= GEO LOCATION (MAP / QUERY) ================= */

    geoLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: function () {
          return this.mode === "offline";
        },
        index: "2dsphere",
      },
    },

    /* ================= STATUS ================= */

    status: {
      type: String,
      enum: ["draft", "published", "completed"],
      default: "draft",
    },

    participantsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 REQUIRED FOR GEO QUERIES
EventSchema.index({ geoLocation: "2dsphere" });

module.exports = mongoose.model("Event", EventSchema);
