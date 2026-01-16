const Team = require("../../models/teammodel");
const User = require("../../models/User.model");
const EventParticipation = require("../../models/Eventparticipationmodel");
const Announcement = require("../../models/annousmentmodel");

/* ============================================================
   HELPERS
============================================================ */

const getMongoUser = async (uid) => {
  const user = await User.findOne({ uid });
  if (!user) throw new Error("User not found");
  return user;
};

/* ============================================================
   INVITE USER TO TEAM
============================================================ */
// POST /api/users/teams/:teamId/invite
exports.inviteToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body; // Mongo _id of invitee

    const inviter = await getMongoUser(req.user.uid);
    const team = await Team.findById(teamId);

    if (!team) return res.status(404).json({ message: "Team not found" });

    if (!team.leader.equals(inviter._id)) {
      return res.status(403).json({ message: "Only team leader can invite" });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        pendingInvites: {
          team: team._id,
          event: team.event,
          invitedAt: new Date(),
        },
      },
    });

    res.json({ success: true, message: "Team invite sent" });
  } catch (err) {
    console.error("inviteToTeam error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   ACCEPT TEAM INVITE
============================================================ */
// POST /api/users/teams/:teamId/accept
exports.acceptTeamInvite = async (req, res) => {
  try {
    const { teamId } = req.params;

    const user = await getMongoUser(req.user.uid);
    const team = await Team.findById(teamId);

    if (!team) return res.status(404).json({ message: "Team not found" });

    if (team.members.includes(user._id)) {
      return res.status(400).json({ message: "Already in team" });
    }

    // Prevent duplicate participation
    const exists = await EventParticipation.findOne({
      user: user._id,
      event: team.event,
    });

    if (exists) {
      return res.status(400).json({ message: "Already registered for event" });
    }

    team.members.push(user._id);
    await team.save();

    await EventParticipation.create({
      user: user._id,
      event: team.event,
      team: team._id,
      role: "member",
    });

    await User.findByIdAndUpdate(user._id, {
      $pull: { pendingInvites: { team: team._id } },
      $addToSet: {
        groups: {
          team: team._id,
          event: team.event,
          role: "member",
          joinedAt: new Date(),
        },
      },
    });

    res.json({ success: true, message: "Joined team successfully" });
  } catch (err) {
    console.error("acceptTeamInvite error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   REJECT TEAM INVITE
============================================================ */
// POST /api/users/teams/:teamId/reject
exports.rejectTeamInvite = async (req, res) => {
  try {
    const user = await getMongoUser(req.user.uid);

    await User.findByIdAndUpdate(user._id, {
      $pull: { pendingInvites: { team: req.params.teamId } },
    });

    res.json({ success: true, message: "Invite rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================================================
   ANNOUNCEMENTS (EVENT + TEAM)
============================================================ */
// GET /api/users/announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const user = await getMongoUser(req.user.uid);

    const teamIds = user.groups.map((g) => g.team);
    const eventIds = user.groups.map((g) => g.event);

    const announcements = await Announcement.find({
      $or: [
        { team: { $in: teamIds } },
        { event: { $in: eventIds } },
      ],
    }).sort({ createdAt: -1 });

    user.unreadAnnouncements = 0;
    await user.save();

    res.json({ success: true, data: announcements });
  } catch (err) {
    console.error("getAnnouncements error:", err);
    res.status(500).json({ message: err.message });
  }
};
