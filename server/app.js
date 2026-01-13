const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/user/auth.routes");
const organiserAuthRoutes = require("./routes/organiser/auth.routes");
const EventsRoutes = require("./routes/organiser/Event.routes");

const app = express();

app.use(helmet());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use("/auth", authRoutes);
app.use("/api/organiser/auth", organiserAuthRoutes);
app.use("/api/event", EventsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
