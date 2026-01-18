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

// app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "https://www.google.com", "https://www.gstatic.com"],
        "frame-src": ["'self'", "https://www.google.com"],
        "connect-src": ["'self'", "https://eventby-1.onrender.com"] // Add your API domain
      },
    },
  })
);

app.use(cookieParser());

app.use(
  cors({
    // Add EVERY possible variant of your Render URL
    origin: [
      "http://localhost:5173", 
      "http://localhost:5174", 
      "https://eventby.onrender.com", 
      "https://eventby-1.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use("/users", authRoutes);
app.use("/teams", teamRoutes);
app.use("/api/organiser/auth", organiserAuthRoutes);
app.use("/api/event", EventsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).send(err.message || "Internal Server Error");
});

module.exports = app;
