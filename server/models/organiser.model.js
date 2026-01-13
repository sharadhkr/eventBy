const mongoose = require("mongoose");

const organiserSchema = new mongoose.Schema(
  {
    organisationName: { type: String, required: true },
    ownerName: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: { type: String, required: true },

    address: { type: String },

    password: { type: String, required: true },

    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organiser", organiserSchema);
