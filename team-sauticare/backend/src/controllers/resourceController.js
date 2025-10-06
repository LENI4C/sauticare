const Resource = require("../models/Resource");
const logger = require("../utils/logger");

class ResourceController {
    /**
     * Get resources with filters
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getResources(req, res) {
        try {
            const {
                language = "en",
                category,
                type,
                limit = 10,
                offset = 0,
                search,
            } = req.query;

            // Build filter object
            const filter = {
                languages: language,
                isActive: true,
            };

            if (category) {
                filter.category = category;
            }

            if (type) {
                filter.type = type;
            }

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { "metadata.tags": { $in: [new RegExp(search, "i")] } },
                ];
            }

            // Get resources
            const resources = await Resource.find(filter)
                .sort({ "rating.average": -1, usageCount: -1 })
                .skip(parseInt(offset))
                .limit(parseInt(limit))
                .lean();

            // Get total count for pagination
            const totalCount = await Resource.countDocuments(filter);

            // Format resources for response
            const formattedResources = resources.map((resource) => ({
                id: resource._id,
                title: resource.translations[language]?.title || resource.title,
                description:
                    resource.translations[language]?.description ||
                    resource.description,
                content:
                    resource.translations[language]?.content ||
                    resource.content,
                type: resource.type,
                category: resource.category,
                languages: resource.languages,
                metadata: {
                    duration: resource.metadata.duration,
                    difficulty: resource.metadata.difficulty,
                    ageGroup: resource.metadata.ageGroup,
                    tags: resource.metadata.tags,
                    author: resource.metadata.author,
                    source: resource.metadata.source,
                },
                accessibility: resource.accessibility,
                crisisRelevant: resource.crisisRelevant,
                emergencyContact: resource.emergencyContact,
                usageCount: resource.usageCount,
                rating: resource.rating,
                createdAt: resource.createdAt,
                updatedAt: resource.updatedAt,
            }));

            res.json({
                success: true,
                data: {
                    resources: formattedResources,
                    pagination: {
                        total: totalCount,
                        limit: parseInt(limit),
                        offset: parseInt(offset),
                        hasMore:
                            parseInt(offset) + parseInt(limit) < totalCount,
                    },
                },
            });
        } catch (error) {
            logger.error("Error in getResources:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve resources",
            });
        }
    }

    /**
     * Get crisis resources
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCrisisResources(req, res) {
        try {
            const { language = "en" } = req.query;

            const resources = await Resource.getCrisisResources(language);

            const formattedResources = resources.map((resource) => ({
                id: resource._id,
                title: resource.translations[language]?.title || resource.title,
                description:
                    resource.translations[language]?.description ||
                    resource.description,
                type: resource.type,
                emergencyContact: resource.emergencyContact,
                phone: resource.emergencyContact?.phone,
                available: resource.emergencyContact?.available,
                rating: resource.rating,
            }));

            res.json({
                success: true,
                data: {
                    resources: formattedResources,
                    hotline: {
                        phone:
                            process.env.CRISIS_HOTLINE_NIGERIA ||
                            "+234-806-210-0053",
                        email:
                            process.env.CRISIS_HOTLINE_EMAIL ||
                            "crisis@sauticare.ng",
                        available: "24/7",
                    },
                },
            });
        } catch (error) {
            logger.error("Error in getCrisisResources:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve crisis resources",
            });
        }
    }

    /**
     * Get a specific resource
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getResource(req, res) {
        try {
            const { resourceId } = req.params;
            const { language = "en" } = req.query;

            const resource = await Resource.findById(resourceId);

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    error: "Resource not found",
                });
            }

            if (!resource.isActive) {
                return res.status(404).json({
                    success: false,
                    error: "Resource is not available",
                });
            }

            const formattedResource = {
                id: resource._id,
                title: resource.translations[language]?.title || resource.title,
                description:
                    resource.translations[language]?.description ||
                    resource.description,
                content:
                    resource.translations[language]?.content ||
                    resource.content,
                type: resource.type,
                category: resource.category,
                languages: resource.languages,
                metadata: {
                    duration: resource.metadata.duration,
                    difficulty: resource.metadata.difficulty,
                    ageGroup: resource.metadata.ageGroup,
                    tags: resource.metadata.tags,
                    author: resource.metadata.author,
                    source: resource.metadata.source,
                    lastUpdated: resource.metadata.lastUpdated,
                },
                accessibility: resource.accessibility,
                crisisRelevant: resource.crisisRelevant,
                emergencyContact: resource.emergencyContact,
                usageCount: resource.usageCount,
                rating: resource.rating,
                createdAt: resource.createdAt,
                updatedAt: resource.updatedAt,
            };

            res.json({
                success: true,
                data: {
                    resource: formattedResource,
                },
            });
        } catch (error) {
            logger.error("Error in getResource:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve resource",
            });
        }
    }

    /**
     * Rate a resource
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async rateResource(req, res) {
        try {
            const { resourceId } = req.params;
            const { rating, comments } = req.body;

            const resource = await Resource.findById(resourceId);

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    error: "Resource not found",
                });
            }

            // Update rating
            await resource.updateRating(rating);

            logger.info(`Resource ${resourceId} rated: ${rating}/5`);

            res.json({
                success: true,
                message: "Resource rated successfully",
                data: {
                    resourceId: resource._id,
                    newRating: resource.rating.average,
                    totalRatings: resource.rating.count,
                },
            });
        } catch (error) {
            logger.error("Error in rateResource:", error);
            res.status(500).json({
                success: false,
                error: "Failed to rate resource",
            });
        }
    }

    /**
     * Record resource usage
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async recordUsage(req, res) {
        try {
            const { resourceId } = req.params;

            const resource = await Resource.findById(resourceId);

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    error: "Resource not found",
                });
            }

            // Increment usage count
            await resource.incrementUsage();

            logger.info(`Resource usage recorded: ${resourceId}`);

            res.json({
                success: true,
                message: "Usage recorded successfully",
                data: {
                    resourceId: resource._id,
                    usageCount: resource.usageCount,
                },
            });
        } catch (error) {
            logger.error("Error in recordUsage:", error);
            res.status(500).json({
                success: false,
                error: "Failed to record usage",
            });
        }
    }
}

module.exports = new ResourceController();
