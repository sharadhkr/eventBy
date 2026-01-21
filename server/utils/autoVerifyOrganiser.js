const Organiser = require("../models/organiser.model");

const autoVerifyOrganiser = async (organiserId) => {
  if (!organiserId) return;

  const organiser = await Organiser.findById(organiserId);
  if (!organiser) return;

  // Auto-verify rule
  if (
    organiser.totalEventsCreated >= 10 &&
    organiser.isVerified === false
  ) {
    organiser.isVerified = true;
    await organiser.save({ validateBeforeSave: false });
  }
};

module.exports = autoVerifyOrganiser;
