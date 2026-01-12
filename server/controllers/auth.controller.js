const User = require("../models/User.model");

const loginOrRegister = async (req, res) => {
  try {
    const fb = req.firebaseUser;

    let user = await User.findOne({ uid: fb.uid });
    const isNewUser = !user;

    if (!user) {
      user = await User.create({
        uid: fb.uid,
        email: fb.email || null,
        phoneNumber: fb.phone_number || null,
        displayName: fb.name || fb.displayName || null,
        photoURL: fb.picture || null,
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    res.json({
      success: true,
      isNewUser,
      user,
    });
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Auth failed" });
  }
};

module.exports = { loginOrRegister };
