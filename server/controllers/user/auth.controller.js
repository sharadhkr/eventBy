const User = require("../../models/User.model");
const { admin } = require("../../config/firebase");

const loginOrRegister = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      console.error("❌ No idToken found in request body");
      return res.status(400).json({ success: false, message: "No ID Token provided" });
    }
    
    // 1. Verify Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // 2. Create 7-Day Session Cookie
    const expiresIn = 60 * 60 * 24 * 7 * 1000; 
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // 3. Set Cookie (localhost fix: secure: false)
    // const isProd = process.env.NODE_ENV === 'production';
    // const options = { 
    //   maxAge: expiresIn, 
    //   httpOnly: true, 
    //   secure: isProd, 
    //   sameSite: isProd ? 'none' : 'Lax',
    //   path: '/' // Ensure cookie is available across all routes
    // };
    const isProd = process.env.NODE_ENV === 'production';
const options = { 
  maxAge: expiresIn, 
  httpOnly: true, 
  secure: isProd, 
  sameSite: isProd ? 'none' : 'Lax',
  path: '/'
};

    res.cookie('session', sessionCookie, options);

    // 4. Sync with MongoDB
    let user = await User.findOne({ uid: decodedToken.uid });
    if (!user) {
      user = await User.create({
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        displayName: decodedToken.name || "New User",
        photoURL: decodedToken.picture || `https://api.dicebear.com{decodedToken.uid}`,
        lastLogin: new Date()
      });
    } else {
      user.lastLogin = new Date();
      if (decodedToken.picture) user.photoURL = decodedToken.picture;
      await user.save();
    }

    const populatedUser = await User.findById(user._id).populate('joinedEvents');
    res.status(200).json({ success: true, user: populatedUser });

  } catch (err) {
    // ✅ CRITICAL: Log the actual error to your terminal
    console.error("❌ Firebase Auth Error:", err.message);
    res.status(401).json({ success: false, message: err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie('session', { path: '/' }); // Path must match the one used to set it
  res.status(200).json({ success: true, message: "Logged out" });
};

module.exports = { loginOrRegister, logout };
