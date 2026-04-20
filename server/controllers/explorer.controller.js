// server/controllers/explorer.controller.js
const {
  scrapeAllEvents,
  scrapeEventsBySource,
  getTrendingEvents,
  getFeaturedEvents,
  getEventSources,
} = require("../utils/eventScraper");

/**
 * Get all events from all sources
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { category, location, search, minPrice, maxPrice, limit = 20, skip = 0 } = req.query;

    const result = await scrapeAllEvents({
      category,
      location,
      search,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Apply pagination
    const events = result.data.slice(skip, skip + limit);

    res.json({
      success: true,
      data: events,
      pagination: {
        total: result.data.length,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
      sources: result.sources,
    });
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch events",
    });
  }
};

/**
 * Get events from a specific source
 */
exports.getEventsBySource = async (req, res) => {
  try {
    const { source } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const result = await scrapeEventsBySource(source);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Apply pagination
    const events = result.data.slice(skip, skip + limit);

    res.json({
      success: true,
      source: result.source,
      data: events,
      pagination: {
        total: result.data.length,
        limit: parseInt(limit),
        skip: parseInt(skip),
      },
    });
  } catch (error) {
    console.error("Error fetching events by source:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch events from source",
    });
  }
};

/**
 * Get trending events
 */
exports.getTrendingEvents = async (req, res) => {
  try {
    const result = await getTrendingEvents();

    res.json({
      success: true,
      title: result.title,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching trending events:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch trending events",
    });
  }
};

/**
 * Get featured events
 */
exports.getFeaturedEvents = async (req, res) => {
  try {
    const result = await getFeaturedEvents();

    res.json({
      success: true,
      title: result.title,
      data: result.data,
    });
  } catch (error) {
    console.error("Error fetching featured events:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch featured events",
    });
  }
};

/**
 * Get all event sources
 */
exports.getEventSources = async (req, res) => {
  try {
    const result = getEventSources();

    res.json(result);
  } catch (error) {
    console.error("Error fetching event sources:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch event sources",
    });
  }
};

/**
 * Search events with filters
 */
exports.searchEvents = async (req, res) => {
  try {
    const { q, category, location, priceMin, priceMax, sort = "trending" } = req.query;

    const result = await scrapeAllEvents({
      search: q,
      category,
      location,
      minPrice: priceMin ? parseInt(priceMin) : undefined,
      maxPrice: priceMax ? parseInt(priceMax) : undefined,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Sort results
    let events = [...result.data];
    switch (sort) {
      case "price_low":
        events.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        events.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        events.sort((a, b) => b.rating - a.rating);
        break;
      case "date":
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "trending":
      default:
        events.sort((a, b) => b.attendees - a.attendees);
    }

    res.json({
      success: true,
      query: q,
      filters: { category, location, priceMin, priceMax },
      data: events,
      totalResults: events.length,
    });
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search events",
    });
  }
};
