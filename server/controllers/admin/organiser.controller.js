const Organiser = require("../../models/organiser.model");

/* =========================================================
   GET ALL ORGANISERS (ADMIN)
========================================================= */
exports.getAllOrganisers = async (req, res) => {
  try {
    const organisers = await Organiser.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: organisers,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organisers" });
  }
};

/* =========================================================
   TOGGLE ACTIVE / INACTIVE
========================================================= */
exports.toggleOrganiserStatus = async (req, res) => {
  try {
    const organiser = await Organiser.findById(req.params.id);
    if (!organiser)
      return res.status(404).json({ message: "Organiser not found" });

    organiser.isActive = !organiser.isActive;
    await organiser.save({ validateBeforeSave: false });

    res.json({
      success: true,
      isActive: organiser.isActive,
    });
  } catch {
    res.status(500).json({ message: "Failed to update status" });
  }
};

/* =========================================================
   TOGGLE VERIFICATION (ADMIN OVERRIDE)
========================================================= */
exports.toggleOrganiserVerification = async (req, res) => {
  try {
    const organiser = await Organiser.findById(req.params.id);
    if (!organiser)
      return res.status(404).json({ message: "Organiser not found" });

    organiser.isVerified = !organiser.isVerified;
    await organiser.save({ validateBeforeSave: false });

    res.json({
      success: true,
      isVerified: organiser.isVerified,
    });
  } catch {
    res.status(500).json({ message: "Failed to update verification" });
  }
};
