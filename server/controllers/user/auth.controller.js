const User = require("../../models/User.model");
const { admin } = require("../../config/firebase");

/* ============================================================
   LOGIN / REGISTER WITH FIREBASE
   POST /users/firebase
============================================================ */
const loginOrRegister = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "No ID Token provided",
      });
    }

    /* 1. Verify Firebase ID Token */
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    /* 2. Create Firebase Session Cookie (7 days) */
    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    /* 3. Set Session Cookie */
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: isProd,                 // HTTPS only in prod
      sameSite: isProd ? "none" : "Lax",
      path: "/",
    });

    /* 4. Sync User with MongoDB */
    let user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      user = await User.create({
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        displayName: decodedToken.name || "New User",
        photoURL:
          decodedToken.picture ||
          `https://api.dicebear.com/6.x/identicon/svg?seed=${decodedToken.uid}`,
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      if (decodedToken.picture) user.photoURL = decodedToken.picture;
      await user.save();
    }

    const populatedUser = await User.findById(user._id).populate(
      "joinedEvents"
    );

    return res.status(200).json({
      success: true,
      user: populatedUser,
    });
  } catch (err) {
    console.error("❌ Firebase Login Error:", err.message);

    return res.status(401).json({
      success: false,
      message: err.message || "Authentication failed",
    });
  }
};

/* ============================================================
   LOGOUT
   POST /users/logout
============================================================ */
const logout = async (req, res) => {
  try {
    const sessionCookie = req.cookies?.session;

    /* Optional: revoke all Firebase sessions */
    if (sessionCookie) {
      const decoded = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
      await admin.auth().revokeRefreshTokens(decoded.sub);
    }
  } catch (err) {
    // Silent fail — logout must always succeed
  }

  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("session", {
    path: "/",
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "Lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = {
  loginOrRegister,
  logout,
};
