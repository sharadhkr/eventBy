const admin = require("firebase-admin");

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;
    next();
  } catch (err) {
    console.error("Firebase Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// MAKE SURE THIS IS THE ONLY EXPORT
module.exports = { verifyFirebaseToken };