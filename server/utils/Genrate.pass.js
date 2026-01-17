// utils/generatePass.js
const crypto = require("crypto");

module.exports = (eventId, userId) => {
  const passId = "PASS-" + crypto.randomBytes(6).toString("hex").toUpperCase();
  return {
    passId,
    qrData: `${eventId}:${userId}:${passId}`
  };
};
