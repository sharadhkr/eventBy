const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    amount: Number,
    status: { type: String, enum: ["created", "paid"], default: "created" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
