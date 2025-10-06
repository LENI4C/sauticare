const express = require("express");
const { body, query, param } = require("express-validator");
const crisisController = require("../controllers/crisisController");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

// Validation rules
const reportCrisisValidation = [
    body("sessionId").notEmpty().withMessage("Session ID is required"),
    body("crisisLevel")
        .isIn(["low", "medium", "high", "critical"])
        .withMessage("Invalid crisis level"),
    body("description")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Description must not exceed 1000 characters"),
    body("location")
        .optional()
        .isLength({ max: 200 })
        .withMessage("Location must not exceed 200 characters"),
    body("contactInfo")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Contact info must not exceed 500 characters"),
];

const crisisStatsValidation = [
    query("startDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid start date format"),
    query("endDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid end date format"),
];

const crisisRecommendationsValidation = [
    query("crisisLevel")
        .isIn(["low", "medium", "high", "critical"])
        .withMessage("Invalid crisis level"),
    query("language")
        .optional()
        .isIn(["en", "pidgin", "hausa"])
        .withMessage("Invalid language code"),
];

const crisisResourcesValidation = [
    query("language")
        .optional()
        .isIn(["en", "pidgin", "hausa"])
        .withMessage("Invalid language code"),
];

// Routes
router.get(
    "/resources",
    crisisResourcesValidation,
    validateRequest,
    crisisController.getCrisisResources
);
router.post(
    "/report",
    reportCrisisValidation,
    validateRequest,
    crisisController.reportCrisis
);
router.get(
    "/stats",
    crisisStatsValidation,
    validateRequest,
    crisisController.getCrisisStats
);
router.get(
    "/recommendations",
    crisisRecommendationsValidation,
    validateRequest,
    crisisController.getCrisisRecommendations
);

module.exports = router;
