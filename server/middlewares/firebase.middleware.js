const { admin } = require("../config/firebase");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies?.session;

    if (!sessionCookie) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("Session verification failed:", err.message);
    return res.status(401).json({ message: "Session expired, please relogin" });
  }
};

module.exports = { verifyFirebaseToken };
