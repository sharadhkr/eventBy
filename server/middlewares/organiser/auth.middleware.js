// server/middlewares/organiser/auth.middleware.js
const jwt = require("jsonwebtoken");
const Organiser = require("../../models/organiser.model");

module.exports = async (req, res, next) => {
  const token = req.cookies.organiser_token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const organiser = await Organiser.findById(decoded.id).select("-password");
    if (!organiser) return res.status(401).json({ message: "Invalid token" });

    req.organiser = organiser;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token expired or invalid" });
  }
};