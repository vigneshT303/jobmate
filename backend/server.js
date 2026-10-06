const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Database
connectDB();

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);

// CORS
const clientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const defaultAllowedOrigins = [
  "https://jobmate-frontend.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...clientUrls]));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith(".onrender.com") ||
        origin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parser
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "500mb"
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes."
  }
});

app.use("/api", limiter);

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "JobMate Backend API is running"
  });
});

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Health check
app.get("/api/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    message: isDbConnected ? "JobMate API is healthy and operational" : "Database is not connected",
    database: isDbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Error handler
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.error(`[UnhandledRejection] ${err.message}`);
});

module.exports = app;