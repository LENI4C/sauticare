const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value,
        }));

        logger.warn("Validation error:", {
            url: req.originalUrl,
            method: req.method,
            errors: errorMessages,
            body: req.body,
            query: req.query,
            params: req.params,
        });

        return res.status(400).json({
            success: false,
            error: "Validation failed",
            details: errorMessages,
        });
    }

    next();
};

module.exports = validateRequest;
