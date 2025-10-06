const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
    try {
        const mongoURI =
            process.env.NODE_ENV === "test"
                ? process.env.MONGODB_TEST_URI
                : process.env.MONGODB_URI;

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error("Database connection error:", error);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
    logger.error("MongoDB error:", err);
});

module.exports = connectDB;
