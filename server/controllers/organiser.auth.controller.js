const Organiser = require("../models/Organiser.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const organiser = await Organiser.findOne({ email });
  if (!organiser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, organiser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: organiser._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("organiser_token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, organiser });
};

exports.logout = (req, res) => {
  res.clearCookie("organiser_token");
  res.json({ success: true });
};
