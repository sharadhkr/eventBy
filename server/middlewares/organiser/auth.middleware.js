const jwt = require("jsonwebtoken");
const Organiser = require("../../models/organiser.model");

module.exports = async (req, res, next) => {
  try {
    const token =
      req.cookies.organiser_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const organiser = await Organiser.findById(decoded.id).select("-password");
    if (!organiser) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🔒 NEW CHECK — ACTIVE STATUS
    if (!organiser.isActive) {
      return res.status(403).json({
        message: "Your organiser account has been disabled by admin",
      });
    }

    req.organiser = organiser;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token expired or invalid",
    });
  }
};
