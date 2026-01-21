const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin.model");

const adminAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.adminToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Admin unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};

module.exports = adminAuth;
