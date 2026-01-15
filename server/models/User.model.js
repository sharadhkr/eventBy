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

    resume: {
      public_id: String,
      url: {
        type: String,
        match: [/^https?:\/\/.+/, "Invalid resume URL"],
      },
      updatedAt: Date,
    },

    portfolio: {
      github: String,
      linkedin: String,
      website: String,
    },

    skills: [{ type: String, trim: true }],

    joinedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    }],

    organizedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    }],

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
