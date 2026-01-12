const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: { type: String, sparse: true },
    phoneNumber: { type: String, sparse: true },
    displayName: String,
    photoURL: String,
    // role: { type: String, default: 'user' },  // ← add later when needed
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);