const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/user/auth.routes");
const teamRoutes = require("./routes/user/Team.routes");
const organiserAuthRoutes = require("./routes/organiser/auth.routes");
const EventsRoutes = require("./routes/organiser/Event.routes");

const app = express();

// 1. HELMET CONFIG: Optimized for reCAPTCHA and API calls
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "https://www.google.com", "https://www.gstatic.com"],
        "frame-src": ["'self'", "https://www.google.com"],
        // Allow connections to self, your Render URL, and Firebase
        "connect-src": [
          "'self'", 
          "https://eventby-1.onrender.com", 
          "https://eventby.onrender.com",
          "https://*.googleapis.com",
          "https://*.firebaseapp.com"
        ],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

app.use(cookieParser());

// 2. CORS CONFIG: Explicitly allowed for Credentials
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174", 
  "https://eventby.onrender.com", 
  "https://eventby-1.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://eventby.onrender.com",
        "https://eventby-1.onrender.com"
      ];
      // Allow internal/non-browser requests or allowed domains
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("CORS Blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  })
);


// 3. PREFLIGHT HANDLER: Fixes CORS "failed" status on complex requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Routes
app.use("/users", authRoutes);
app.use("/teams", teamRoutes);

app.use("/api/organiser/auth", organiserAuthRoutes);
app.use("/api/event", EventsRoutes);

app.use("/api/admin/dashboard", require("./routes/admin/dashboard.routes"));
app.use("/api/admin/top-events", require("./routes/admin/Top.event.router"));
app.use("/api/admin", require("./routes/admin/auth.router"));
app.use("/api/admin/organisers", require("./routes/admin/organizer.routes"));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || "Internal Server Error" 
  });
});

module.exports = app;
