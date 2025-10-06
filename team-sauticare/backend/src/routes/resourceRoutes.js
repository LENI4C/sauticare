const express = require("express");
const { query, param } = require("express-validator");
const resourceController = require("../controllers/resourceController");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

// Validation rules
const getResourcesValidation = [
    query("language")
        .optional()
        .isIn(["en", "pidgin", "hausa"])
        .withMessage("Invalid language code"),
    query("category")
        .optional()
        .isIn([
            "anxiety",
            "depression",
            "stress",
            "trauma",
            "crisis",
            "general",
            "coping",
            "meditation",
        ])
        .withMessage("Invalid category"),
    query("type")
        .optional()
        .isIn([
            "article",
            "video",
            "audio",
            "exercise",
            "hotline",
            "emergency",
            "tool",
        ])
        .withMessage("Invalid resource type"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be between 1 and 50"),
    query("offset")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Offset must be non-negative"),
];

const getResourceValidation = [
    param("resourceId").isMongoId().withMessage("Invalid resource ID format"),
];

const rateResourceValidation = [
    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),
    body("comments")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Comments must not exceed 500 characters"),
];

// Routes
router.get(
    "/",
    getResourcesValidation,
    validateRequest,
    resourceController.getResources
);
router.get("/crisis", resourceController.getCrisisResources);
router.get(
    "/:resourceId",
    getResourceValidation,
    validateRequest,
    resourceController.getResource
);
router.post(
    "/:resourceId/rate",
    getResourceValidation,
    rateResourceValidation,
    validateRequest,
    resourceController.rateResource
);
router.post(
    "/:resourceId/use",
    getResourceValidation,
    validateRequest,
    resourceController.recordUsage
);

module.exports = router;
