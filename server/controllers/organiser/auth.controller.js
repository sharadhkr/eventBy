const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organiser = require("../../models/organiser.model");

/* ================= REGISTER ================= */
exports.registerOrganiser = async (req, res) => {
  try {
    const { organisationName, ownerName, email, phone, address, password } =
      req.body;

    if (!organisationName || !ownerName || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Organiser.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const organiser = await Organiser.create({
      organisationName,
      ownerName,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Organiser registered successfully",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= LOGIN ================= */
exports.loginOrganiser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const organiser = await Organiser.findOne({ email });
    if (!organiser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, organiser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    organiser.lastLogin = new Date();
    await organiser.save();

    const token = jwt.sign(
      { id: organiser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("organiser_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      organiser: {
        id: organiser._id,
        organisationName: organiser.organisationName,
        ownerName: organiser.ownerName,
        email: organiser.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= LOGOUT ================= */
exports.logoutOrganiser = (req, res) => {
  res.clearCookie("organiser_token");
  res.json({ success: true, message: "Logged out" });
};
