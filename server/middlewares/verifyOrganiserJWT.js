const jwt = require("jsonwebtoken");
const Organiser = require("../models/Organiser.model");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.organiser_token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const organiser = await Organiser.findById(decoded.id);

    if (!organiser) return res.status(401).json({ message: "Invalid token" });

    req.organiser = organiser;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
