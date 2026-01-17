const Team = require('../../models/team.model');
const User = require('../../models/User.model');

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ]
    })
    .limit(5)
    /* ✅ Crucial: Must select 'uid' to send it to the frontend */
    .select('displayName email photoURL uid'); 

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/team.controller.js

exports.createTeam = async (req, res) => {
  try {
    const { name, size, inviteeIds } = req.body; 
    const creatorFirebaseUid = req.uid || req.user?.uid;

    // 1. Find the Leader (We still use Firebase UID here because it comes from Auth Middleware)
    const leaderUser = await User.findOne({ uid: creatorFirebaseUid });
    if (!leaderUser) return res.status(404).json({ message: "Leader not found in DB" });

    // 2. Find Invited Users using MongoDB _id (since frontend is sending _ids)
    // ✅ CHANGED: We now search by _id
    const invitedUsers = await User.find({ _id: { $in: inviteeIds } });
    
    console.log("Invitee IDs received:", inviteeIds);
    console.log("Users found in DB:", invitedUsers.length);

    if (invitedUsers.length !== inviteeIds.length) {
      return res.status(400).json({ 
        success: false,
        message: "Some invited users were not found in the database." 
      });
    }

    // 3. Build the members array
    const members = invitedUsers.map(user => ({ 
      user: user._id, 
      status: 'pending' 
    }));

    // Add the leader as 'accepted'
    members.push({ user: leaderUser._id, status: 'accepted' });

    // 4. Create the Team
    const team = await Team.create({
      name,
      size,
      leader: leaderUser._id,
      members
    });

    res.status(201).json({ success: true, data: team });
  } catch (err) {
    // Handle Duplicate Name Error
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already have a team with this name!" });
    }
    console.error("❌ Team Create Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
// 3. Get User Notifications (Pending Invites)
exports.getInvites = async (req, res) => {
  try {
    const firebaseUid = req.uid || req.user?.uid;
    
    // 1. Get the MongoDB _id for the current user
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Search teams where THIS MongoDB _id is pending
    const invites = await Team.find({
      'members': { $elemMatch: { user: user._id, status: 'pending' } }
    }).populate('leader', 'displayName photoURL');
    
    res.status(200).json({ success: true, data: invites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Accept or Reject Invite
exports.respondToInvite = async (req, res) => {
  try {
    const { teamId, action } = req.body; 
    const firebaseUid = req.uid || req.user?.uid;

    // 1. Get the MongoDB _id
    const user = await User.findOne({ uid: firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === 'accept') {
      // Update the specific member object inside the array
      await Team.updateOne(
        { _id: teamId, 'members.user': user._id },
        { $set: { 'members.$.status': 'accepted' } }
      );
    } else {
      // Remove the member object entirely from the array
      await Team.updateOne(
        { _id: teamId },
        { $pull: { members: { user: user._id } } }
      );
    }

    res.status(200).json({ success: true, message: `Invite ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};