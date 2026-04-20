// server/utils/eventScraper.js
/**
 * Web Scraping Utility for Events Data
 * Fetches events from multiple sources and aggregates them
 */

const axios = require("axios");

// Mock data sources - these would be real APIs/scraped data in production
const EVENT_SOURCES = {
  eventbrite: {
    name: "Eventbrite",
    url: "https://www.eventbrite.com/api/v3/events/search",
    category: "All Events",
    icon: "🎫",
  },
  meetup: {
    name: "Meetup",
    url: "https://api.meetup.com/",
    category: "Meetup Groups",
    icon: "👥",
  },
  facebook: {
    name: "Facebook Events",
    url: "https://graph.facebook.com/",
    category: "Social Events",
    icon: "👕",
  },
  ticketmaster: {
    name: "Ticketmaster",
    url: "https://developer.ticketmaster.com/",
    category: "Entertainment",
    icon: "🎭",
  },
};

// Mock scraped events data - in production, these would come from real APIs
const MOCK_EVENTS = [
  {
    id: "evt_1",
    title: "Tech Summit 2024",
    description: "Join industry leaders for the biggest tech conference of the year",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: "09:00 AM",
    location: "San Francisco, CA",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    attendees: 1234,
    rating: 4.8,
    price: 199,
    source: "eventbrite",
    tags: ["tech", "conference", "2024"],
  },
  {
    id: "evt_2",
    title: "AI Workshop - Hands On",
    description: "Learn cutting-edge AI & Machine Learning techniques",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: "02:00 PM",
    location: "New York, NY",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    attendees: 456,
    rating: 4.9,
    price: 149,
    source: "meetup",
    tags: ["AI", "machine-learning", "workshop"],
  },
  {
    id: "evt_3",
    title: "Web Development Bootcamp",
    description: "12-week intensive bootcamp for aspiring web developers",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    time: "10:00 AM",
    location: "Los Angeles, CA",
    category: "Education",
    image: "https://images.unsplash.com/photo-1516534775068-bb57a2e9b91e?w=500&h=300&fit=crop",
    attendees: 89,
    rating: 4.7,
    price: 3999,
    source: "eventbrite",
    tags: ["bootcamp", "web-dev", "education"],
  },
  {
    id: "evt_4",
    title: "Digital Marketing Mastery",
    description: "Master social media, SEO, and content marketing",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    time: "11:00 AM",
    location: "Chicago, IL",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    attendees: 678,
    rating: 4.6,
    price: 299,
    source: "facebook",
    tags: ["marketing", "digital", "seo"],
  },
  {
    id: "evt_5",
    title: "Design Thinking Workshop",
    description: "Learn design thinking principles and methodologies",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: "01:00 PM",
    location: "Boston, MA",
    category: "Design",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop",
    attendees: 234,
    rating: 4.8,
    price: 99,
    source: "meetup",
    tags: ["design", "thinking", "workshop"],
  },
  {
    id: "evt_6",
    title: "Startup Pitch Competition",
    description: "Compete with other startups and pitch to investors",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    time: "06:00 PM",
    location: "Seattle, WA",
    category: "Entrepreneurship",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    attendees: 156,
    rating: 4.9,
    price: 0,
    source: "ticketmaster",
    tags: ["startup", "pitch", "business"],
  },
];

/**
 * Scrape events from all sources
 */
const scrapeAllEvents = async (filters = {}) => {
  try {
    // Simulate API calls to different sources
    const events = [...MOCK_EVENTS];

    // Apply filters
    if (filters.category) {
      events.filter((e) => e.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.location) {
      events.filter((e) =>
        e.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.search) {
      events.filter(
        (e) =>
          e.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          e.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.minPrice !== undefined) {
      events.filter((e) => e.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      events.filter((e) => e.price <= filters.maxPrice);
    }

    return {
      success: true,
      data: events,
      sources: EVENT_SOURCES,
      totalEvents: events.length,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return {
      success: false,
      error: "Failed to scrape events",
      data: [],
    };
  }
};

/**
 * Scrape events from a specific source
 */
const scrapeEventsBySource = async (source) => {
  try {
    const sourceConfig = EVENT_SOURCES[source];
    if (!sourceConfig) {
      throw new Error(`Unknown source: ${source}`);
    }

    // In production, make actual API calls here
    const events = MOCK_EVENTS.filter((e) => e.source === source);

    return {
      success: true,
      source: sourceConfig.name,
      data: events,
      totalEvents: events.length,
    };
  } catch (error) {
    console.error(`Error scraping from ${source}:`, error);
    return {
      success: false,
      error: `Failed to scrape from ${source}`,
      data: [],
    };
  }
};

/**
 * Get trending events
 */
const getTrendingEvents = async () => {
  const events = [...MOCK_EVENTS].sort((a, b) => b.attendees - a.attendees);
  return {
    success: true,
    data: events.slice(0, 5),
    title: "Trending Events",
  };
};

/**
 * Get featured events
 */
const getFeaturedEvents = async () => {
  const events = [...MOCK_EVENTS].sort((a, b) => b.rating - a.rating);
  return {
    success: true,
    data: events.slice(0, 5),
    title: "Featured Events",
  };
};

/**
 * Get event sources
 */
const getEventSources = () => {
  return {
    success: true,
    sources: Object.entries(EVENT_SOURCES).map(([key, value]) => ({
      id: key,
      ...value,
    })),
  };
};

module.exports = {
  scrapeAllEvents,
  scrapeEventsBySource,
  getTrendingEvents,
  getFeaturedEvents,
  getEventSources,
  MOCK_EVENTS,
  EVENT_SOURCES,
};
