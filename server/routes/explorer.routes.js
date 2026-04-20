// server/routes/explorer.routes.js
const express = require("express");
const router = express.Router();
const explorerController = require("../controllers/explorer.controller");

/**
 * @route   GET /api/explorer/events
 * @desc    Get all events from all sources
 * @query   category, location, search, minPrice, maxPrice, limit, skip
 * @public
 */
router.get("/events", explorerController.getAllEvents);

/**
 * @route   GET /api/explorer/events/trending
 * @desc    Get trending events
 * @public
 */
router.get("/events/trending", explorerController.getTrendingEvents);

/**
 * @route   GET /api/explorer/events/featured
 * @desc    Get featured events
 * @public
 */
router.get("/events/featured", explorerController.getFeaturedEvents);

/**
 * @route   GET /api/explorer/source/:source
 * @desc    Get events from a specific source
 * @params  source - eventbrite, meetup, facebook, ticketmaster
 * @public
 */
router.get("/source/:source", explorerController.getEventsBySource);

/**
 * @route   GET /api/explorer/sources
 * @desc    Get all available event sources
 * @public
 */
router.get("/sources", explorerController.getEventSources);

/**
 * @route   GET /api/explorer/search
 * @desc    Search events with filters
 * @query   q, category, location, priceMin, priceMax, sort
 * @public
 */
router.get("/search", explorerController.searchEvents);

module.exports = router;
