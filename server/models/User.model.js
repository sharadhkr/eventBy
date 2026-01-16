const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    displayName: String,
    photoURL: String,

    role: {
      type: String,
      enum: ["user", "organiser", "admin"],
      default: "user",
    },

    /* ======================
       PROFILE TRACKING
    ====================== */
    skills: [String],

    portfolio: {
      github: String,
      linkedin: String,
      website: String,
    },

    resume: {
      public_id: String,
      url: String,
      updatedAt: Date,
    },

    /* ======================
       EVENT TRACKING (SUMMARY)
    ====================== */
    joinedEvents: [
      {
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        joinedAt: Date,
        mode: {
          type: String,
          enum: ["solo", "team"],
        },
      },
    ],

    savedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
pendingInvites: [
  {
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    invitedAt: Date,
  },
],

unreadAnnouncements: { type: Number, default: 0 },

    /* ======================
       GROUP / TEAM TRACKING
    ====================== */
    groups: [
      {
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
        },
        event: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
        },
        role: {
          type: String,
          enum: ["leader", "member"],
        },
        joinedAt: Date,
      },
    ],

    /* ======================
       NOTIFICATIONS
    ====================== */
    unreadAnnouncements: {
      type: Number,
      default: 0,
    },

    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", function () {
  if (this.isModified("resume.url")) {
    this.resume.updatedAt = new Date();
  }
});

module.exports = mongoose.model("User", userSchema);
