const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, "Firebase UID is required"],
      unique: true,
      index: true,
    },
    email: { 
      type: String, 
      sparse: true, 
      lowercase: true,
      trim: true 
    },
    displayName: String,
    photoURL: String,
    role: { 
      type: String, 
      enum: ['user', 'organiser', 'admin'], 
      default: 'user' 
    },
    resume: {
      public_id: { type: String }, 
      url: { 
        type: String,
        match: [/^https?:\/\/.+/, "Please provide a valid URL for the resume"]
      },
      updatedAt: { type: Date }
    },
    portfolio: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      website: { type: String, trim: true }
    },
    skills: [{
      type: String,
      trim: true
    }],
    joinedEvents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    }],
    lastLogin: { type: Date },
  },
  { timestamps: true }
);
organizedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  }],
/**
 * FIXED MIDDLEWARE
 * We remove the 'next' parameter and use a standard function.
 * This prevents the "next is not a function" error when used with async save calls.
 */
userSchema.pre('save', async function() {
  if (this.isModified('resume.url')) {
    this.resume.updatedAt = new Date();
  }
});
module.exports = mongoose.model("User", userSchema);
