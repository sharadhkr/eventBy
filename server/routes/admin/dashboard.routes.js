const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/admin/auth.middleware");

const {
  getAdminOverview,
  getGrowthAnalytics,
  getEventAnalytics,
  getRevenueAnalytics,
  getTopEntities
} = require("../../controllers/admin/dashboard.controller");

/* OVERVIEW */
router.get("/overview", adminAuth, getAdminOverview);

/* GRAPHS */
router.get("/growth", adminAuth, getGrowthAnalytics);

/* EVENTS */
router.get("/events", adminAuth, getEventAnalytics);

/* REVENUE */
router.get("/revenue", adminAuth, getRevenueAnalytics);

/* LEADERBOARDS */
router.get("/top", adminAuth, getTopEntities);

module.exports = router;
