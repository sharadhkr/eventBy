const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const Event = require("../../models/Event.model");
const Payment = require("../../models/Payment.model");
const EventParticipation = require("../../models/EventParticipation.model");
const EventPass = require("../../models/EventPass.model");
const razorpay = require("../../utils/razorpay");
const generatePass = require("../../utils/generatePass");
const userAuth = require("../../middlewares/userAuth");

/* ==========================================================
   CREATE ORDER
========================================================== */
router.post("/create-order/:eventId", userAuth, async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event || !event.isPaid)
    return res.status(400).json({ message: "Invalid paid event" });

  const order = await razorpay.orders.create({
    amount: event.price * 100,
    currency: "INR",
    receipt: `evt_${event._id}_${req.user._id}`,
  });

  await Payment.create({
    user: req.user._id,
    event: event._id,
    amount: event.price,
    razorpayOrderId: order.id,
  });

  res.json({
    success: true,
    order,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

/* ==========================================================
   VERIFY PAYMENT & JOIN EVENT
========================================================== */
router.post("/verify", userAuth, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    eventId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature)
    return res.status(400).json({ message: "Invalid payment signature" });

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "paid",
    },
    { new: true }
  );

  if (!payment) return res.status(404).json({ message: "Payment not found" });

  await EventParticipation.create({
    event: eventId,
    user: req.user._id,
  });

  const { passId, qrData } = generatePass(eventId, req.user._id);

  const pass = await EventPass.create({
    event: eventId,
    user: req.user._id,
    passId,
    qrData,
  });

  await Event.findByIdAndUpdate(eventId, {
    $inc: { participantsCount: 1, revenue: payment.amount },
  });

  res.json({
    success: true,
    message: "Payment successful & joined event",
    pass,
  });
});

module.exports = router;
