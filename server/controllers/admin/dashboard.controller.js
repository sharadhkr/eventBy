const User = require("../../models/User.model");
const Organiser = require("../../models/organiser.model");
const Event = require("../../models/Event.model");
const EventParticipation = require("../../models/Event.participation.model");
const Payment = require("../../models/Payment.model");

/* =========================================================
   1. OVERVIEW CARDS (TOP METRICS)
========================================================= */
exports.getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrganisers,
      totalEvents,
      totalBookings,
      revenueAgg,
      pendingEvents
    ] = await Promise.all([
      User.countDocuments(),
      Organiser.countDocuments(),
      Event.countDocuments(),
      EventParticipation.countDocuments(),
      Payment.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Event.countDocuments({ status: "draft" })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOrganisers,
        totalEvents,
        totalBookings,
        totalRevenue: revenueAgg[0]?.total || 0,
        pendingEvents
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard overview failed" });
  }
};

exports.getGrowthAnalytics = async (req, res) => {
  try {
    const range = req.query.range || "30"; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(range));

    const [users, organisers, events, bookings] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Organiser.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Event.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      EventParticipation.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: { users, organisers, events, bookings }
    });
  } catch (err) {
    res.status(500).json({ message: "Growth analytics failed" });
  }
};

exports.getEventAnalytics = async (req, res) => {
  try {
    const [byStatus, byMode, topEvents] = await Promise.all([
      Event.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Event.aggregate([
        { $group: { _id: "$mode", count: { $sum: 1 } } }
      ]),
      Event.find({})
        .sort({ participantsCount: -1 })
        .limit(5)
        .select("title participantsCount price")
        .populate("organiser", "organisationName")
        .lean()
    ]);

    res.json({
      success: true,
      data: { byStatus, byMode, topEvents }
    });
  } catch (err) {
    res.status(500).json({ message: "Event analytics failed" });
  }
};

exports.getRevenueAnalytics = async (req, res) => {
  try {
    const revenueTimeline = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: revenueTimeline
    });
  } catch (err) {
    res.status(500).json({ message: "Revenue analytics failed" });
  }
};

exports.getTopEntities = async (req, res) => {
  try {
    const [topOrganisers, topUsers] = await Promise.all([
      Organiser.find({})
        .sort({ followerCount: -1 })
        .limit(5)
        .select("organisationName followerCount logo")
        .lean(),
      EventParticipation.aggregate([
        {
          $group: {
            _id: "$user",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 0,
            count: 1,
            user: {
              displayName: "$user.displayName",
              photoURL: "$user.photoURL"
            }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: { topOrganisers, topUsers }
    });
  } catch (err) {
    res.status(500).json({ message: "Leaderboard fetch failed" });
  }
};
