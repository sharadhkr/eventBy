const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const idToken = authHeader.replace("Bearer ", "");

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      phone: decodedToken.phone_number || null,
      name: decodedToken.name || decodedToken.displayName || null,
      picture: decodedToken.picture || null,
    };

    next();
  } catch (error) {
    console.error("🔥 Firebase token verification failed:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = { verifyToken };
