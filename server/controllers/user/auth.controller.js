const User = require("../../models/User.model");
const { admin } = require("../../config/firebase");
const jwt = require("jsonwebtoken");

/* ============================================================
   LOGIN / REGISTER WITH FIREBASE (STABLE)
   POST /users/firebase
============================================================ */

const loginOrRegister = async (req, res) => {
  console.log("🔥 Login Request Received");
  
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "No ID token provided",
      });
    }

    // 1. Decode purely for logging (don't name this 'jwt')
    const tokenParts = idToken.split(".");
    if (tokenParts.length > 1) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());
        console.log("🔥 TOKEN ISS:", payload.iss);
        console.log("🔥 TOKEN AUD:", payload.aud);
    }

    /* 2. Verify Firebase ID Token (The Real Check) */
    // If .env emulator lines are commented out, this checks against Google's public keys
    const decoded = await admin.auth().verifyIdToken(idToken);
    
    console.log("✅ Firebase Token Verified for UID:", decoded.uid);

    /* 3. Sync User with MongoDB */
    let user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      user = await User.create({
        uid: decoded.uid,
        email: decoded.email || "",
        displayName: decoded.name || "New User",
        photoURL:
          decoded.picture ||
          `https://api.dicebear.com{decoded.uid}`,
        provider: decoded.firebase?.sign_in_provider,
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      if (decoded.picture) user.photoURL = decoded.picture;
      await user.save();
    }

    /* 4. ISSUE OUR OWN JWT */
    // We use the global 'jwt' require variable here
    const appToken = jwt.sign(
      {
        uid: user.uid,
        userId: user._id,
        role: user.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const populatedUser = await User.findById(user._id).populate("joinedEvents");

    return res.status(200).json({
      success: true,
      token: appToken,
      user: populatedUser,
    });
  } catch (err) {
    console.error("❌ Firebase Login Error:", err.message);
    
    return res.status(401).json({
      success: false,
      message: "Authentication failed: " + err.message,
    });
  }
};
/* ============================================================
   LOGOUT (SIMPLE & SAFE)
   POST /users/logout
============================================================ */
const logout = async (_req, res) => {
  // 🔥 Stateless logout — frontend deletes token
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = {
  loginOrRegister,
  logout,
};
