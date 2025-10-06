const express = require("express");
const { body, param, query } = require("express-validator");
const chatController = require("../controllers/chatController");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

// Validation rules
const sendMessageValidation = [
    body("message")
        .notEmpty()
        .withMessage("Message is required")
        .isLength({ min: 1, max: 2000 })
        .withMessage("Message must be between 1 and 2000 characters"),
    body("sessionId").notEmpty().withMessage("Session ID is required"),
    body("userId").optional().isMongoId().withMessage("Invalid user ID format"),
    body("mood")
        .optional()
        .isIn([
            "excited",
            "happy",
            "calm",
            "neutral",
            "anxious",
            "sad",
            "angry",
            "grateful",
        ])
        .withMessage("Invalid mood value"),
];

const startConversationValidation = [
    body("userId").optional().isMongoId().withMessage("Invalid user ID format"),
    body("preferredLanguage")
        .optional()
        .isIn(["en", "pidgin", "hausa"])
        .withMessage("Invalid language preference"),
];

const endConversationValidation = [
    body("feedback.helpful")
        .optional()
        .isBoolean()
        .withMessage("Feedback helpful must be boolean"),
    body("feedback.rating")
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage("Feedback rating must be between 1 and 5"),
    body("feedback.comments")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Feedback comments must not exceed 500 characters"),
];

const sessionIdValidation = [
    param("sessionId").notEmpty().withMessage("Session ID is required"),
];

const queryValidation = [
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
    query("offset")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Offset must be non-negative"),
];

const moodValidation = [
    body("mood")
        .notEmpty()
        .withMessage("Mood is required")
        .isIn([
            "excited",
            "happy",
            "calm",
            "neutral",
            "anxious",
            "sad",
            "angry",
            "grateful",
        ])
        .withMessage("Invalid mood value"),
    body("context")
        .optional()
        .isLength({ max: 200 })
        .withMessage("Context must not exceed 200 characters"),
];

const userIdValidation = [
    param("userId").isMongoId().withMessage("Invalid user ID format"),
];

// Routes
router.post(
    "/send",
    sendMessageValidation,
    validateRequest,
    chatController.sendMessage
);
router.post(
    "/start",
    startConversationValidation,
    validateRequest,
    chatController.startConversation
);
router.post(
    "/end/:sessionId",
    sessionIdValidation,
    endConversationValidation,
    validateRequest,
    chatController.endConversation
);
router.get(
    "/:sessionId",
    sessionIdValidation,
    queryValidation,
    validateRequest,
    chatController.getConversation
);
router.get(
    "/:sessionId/analytics",
    sessionIdValidation,
    validateRequest,
    chatController.getConversationAnalytics
);

// Mood tracking routes
router.put(
    "/mood/:userId",
    userIdValidation,
    moodValidation,
    validateRequest,
    chatController.updateMood
);
router.get(
    "/mood/:userId/history",
    userIdValidation,
    queryValidation,
    validateRequest,
    chatController.getMoodHistory
);

module.exports = router;
