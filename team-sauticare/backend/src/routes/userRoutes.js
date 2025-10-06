const express = require("express");
const { body, param } = require("express-validator");
const userController = require("../controllers/userController");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

// Validation rules
const createUserValidation = [
    body("username")
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            "Username can only contain letters, numbers, and underscores"
        ),
    body("email")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("preferredLanguage")
        .optional()
        .isIn(["en", "pidgin", "hausa"])
        .withMessage("Invalid language preference"),
    body("isAnonymous")
        .optional()
        .isBoolean()
        .withMessage("isAnonymous must be boolean"),
];

const updateUserValidation = [
    body("preferredLanguage")
        .optional()
        .isIn(["en", "pidgin", "hausa"])
        .withMessage("Invalid language preference"),
    body("profile.age")
        .optional()
        .isInt({ min: 13, max: 120 })
        .withMessage("Age must be between 13 and 120"),
    body("profile.gender")
        .optional()
        .isIn(["male", "female", "other", "prefer-not-to-say"])
        .withMessage("Invalid gender option"),
    body("profile.location")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Location must not exceed 100 characters"),
    body("mentalHealthHistory.hasHistory")
        .optional()
        .isBoolean()
        .withMessage("hasHistory must be boolean"),
    body("mentalHealthHistory.conditions")
        .optional()
        .isArray()
        .withMessage("Conditions must be an array"),
    body("mentalHealthHistory.conditions.*")
        .optional()
        .isIn(["anxiety", "depression", "ptsd", "bipolar", "other"])
        .withMessage("Invalid condition type"),
    body("mentalHealthHistory.isReceivingTreatment")
        .optional()
        .isBoolean()
        .withMessage("isReceivingTreatment must be boolean"),
];

const userIdValidation = [
    param("userId").isMongoId().withMessage("Invalid user ID format"),
];

// Routes
router.post(
    "/register",
    createUserValidation,
    validateRequest,
    userController.register
);
router.post("/login", userController.login);
router.get(
    "/profile/:userId",
    userIdValidation,
    validateRequest,
    userController.getProfile
);
router.put(
    "/profile/:userId",
    userIdValidation,
    updateUserValidation,
    validateRequest,
    userController.updateProfile
);
router.delete(
    "/:userId",
    userIdValidation,
    validateRequest,
    userController.deleteUser
);

module.exports = router;
