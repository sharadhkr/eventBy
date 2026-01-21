const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin.model");

/* ============================
   REGISTER ADMIN
============================ */
exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await Admin.findOne({ username });
    if (exists)
      return res.status(409).json({ message: "Admin already exists" });

    const admin = await Admin.create({ username, password });

    res.status(201).json({
      success: true,
      message: "Admin registered",
    });
  } catch (error) {
    console.error("Admin register error:", error);
    res.status(500).json({ message: "Admin registration failed" });
  }
};

/* ============================
   LOGIN ADMIN
============================ */
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        token,
        admin: {
          id: admin._id,
          username: admin.username,
        },
      });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Admin login failed" });
  }
};

/* ============================
   LOGOUT ADMIN
============================ */
exports.logoutAdmin = async (req, res) => {
  res
    .clearCookie("adminToken")
    .status(200)
    .json({ success: true, message: "Admin logged out" });
};

/* ============================
   GET ADMIN PROFILE
============================ */
exports.getAdminProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};
