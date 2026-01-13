const User = require("../../models/User.model");

const loginOrRegister = async (req, res) => {
  try {
    const fb = req.firebaseUser;

    // 1. Try to find the user
    let user = await User.findOne({ uid: fb.uid });
    const isNewUser = !user;

    if (isNewUser) {
      // 2. Create detailed production-ready user
      user = await User.create({
        uid: fb.uid,
        email: fb.email ? fb.email.toLowerCase() : null,
        phoneNumber: fb.phone_number || null,
        displayName: fb.name || "New User",
        photoURL: fb.picture || `api.dicebear.com{fb.uid}`,
        role: 'user', // Default role from schema
        isActive: true,
        lastLogin: new Date(),
        // Initialize empty social object if needed
        socialLinks: { instagram: "", twitter: "", linkedin: "" }
      });
    } else {
      // 3. Update existing user (Sync latest info from Firebase)
      user.lastLogin = new Date();
      
      // Optional: Sync photoURL if it changed in Google/Firebase
      if (fb.picture && user.photoURL !== fb.picture) {
        user.photoURL = fb.picture;
      }
      
      await user.save();
    }

    // 4. Populate joined events so frontend AuthContext has full data immediately
  const populatedUser = await User.findById(user._id)
  .populate('joinedEvents'); 

    res.status(200).json({
      success: true,
      isNewUser,
      user: populatedUser,
    });
  } catch (err) {
    console.error("Auth controller error:", err);
    res.status(500).json({ 
      success: false, 
      message: "Authentication failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

module.exports = { loginOrRegister };
