const Team = require('../../models/team.model');
const User = require('../../models/User.model');
const Notification = require('../../models/Notification.model');

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
    const io = req.app.get("io");

    const leaderUser = await User.findOne({ uid: creatorFirebaseUid });
    if (!leaderUser) return res.status(404).json({ message: "Leader not found in DB" });

    const invitedUsers = await User.find({ _id: { $in: inviteeIds } });
    if (invitedUsers.length !== inviteeIds.length) {
      return res.status(400).json({ message: "Some invited users not found" });
    }

    const members = invitedUsers.map(user => ({
      user: user._id,
      status: "pending"
    }));

    members.push({ user: leaderUser._id, status: "accepted" });

    const team = await Team.create({
      name,
      size,
      leader: leaderUser._id,
      members
    });

    /* 🔔 SOCKET + DB NOTIFICATION */
    for (const member of members) {
      if (member.user.toString() !== leaderUser._id.toString()) {

        await Notification.create({
          user: member.user,
          type: "TEAM_INVITE",
          title: "Team Invitation",
          message: `${leaderUser.displayName} invited you to join ${name}`,
          team: team._id
        });

        io.to(`user:${member.user}`).emit("notification:new", {
          type: "TEAM_INVITE",
          teamId: team._id,
          teamName: name,
          leader: leaderUser.displayName
        });
      }
    }

    res.status(201).json({ success: true, data: team });

  } catch (err) {
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
exports.respondToInvite = async (req, res) => {
  try {
    const { teamId, action } = req.body;
    const firebaseUid = req.uid || req.user?.uid;
    const io = req.app.get("io");

    const user = await User.findOne({ uid: firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "accept") {
      await Team.updateOne(
        { _id: teamId, "members.user": user._id },
        { $set: { "members.$.status": "accepted" } }
      );
    } else {
      await Team.updateOne(
        { _id: teamId },
        { $pull: { members: { user: user._id } } }
      );
    }

    const team = await Team.findById(teamId).populate("leader");

    /* 🔔 NOTIFY LEADER */
    await Notification.create({
      user: team.leader._id,
      type: "TEAM_ACCEPTED",
      title: "Team Update",
      message: `${user.displayName} ${action}ed your team invite`,
      team: teamId
    });

    io.to(`user:${team.leader._id}`).emit("notification:new", {
      type: "TEAM_ACCEPTED",
      teamId,
      user: user.displayName,
      action
    });

    res.status(200).json({ success: true, message: `Invite ${action}ed successfully` });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
