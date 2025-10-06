const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
require("dotenv").config();

const connectDB = require("./config/database");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const crisisRoutes = require("./routes/crisisRoutes");
const resourceRoutes = require("./routes/resourceRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "SautiCare API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// API routes
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/crisis", crisisRoutes);
app.use("/api/resources", resourceRoutes);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: "Route not found",
    });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    logger.info(
        `SautiCare API server running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
});

// Graceful shutdown
process.on("SIGTERM", () => {
    logger.info("SIGTERM received, shutting down gracefully");
    server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
    });
});

module.exports = app;
