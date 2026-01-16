const admin = require("firebase-admin");

const verifyFirebaseToken = async (req, res, next) => {
  const sessionCookie = req.cookies.session; // 👈 Check 7-day cookie

  try {
    let decoded;
    if (sessionCookie) {
      // Use Firebase Admin to verify the cookie
      decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    } else {
      // Fallback to Bearer token if cookie is missing
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: "No session" });
      const token = authHeader.split("Bearer ")[1];
      decoded = await admin.auth().verifyIdToken(token);
    }

    req.user = { uid: decoded.uid, email: decoded.email };
    next();
  } catch (err) {
    res.status(401).json({ message: "Session expired, please relogin" });
  }
};

module.exports = { verifyFirebaseToken };
