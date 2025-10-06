const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Resource = require("../models/Resource");
const logger = require("../utils/logger");

class CrisisController {
    /**
     * Get crisis resources
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCrisisResources(req, res) {
        try {
            const { language = "en" } = req.query;

            const resources = await Resource.getCrisisResources(language);

            res.json({
                success: true,
                data: {
                    resources: resources.map((resource) => ({
                        id: resource._id,
                        title:
                            resource.translations[language]?.title ||
                            resource.title,
                        description:
                            resource.translations[language]?.description ||
                            resource.description,
                        type: resource.type,
                        emergencyContact: resource.emergencyContact,
                        phone: resource.emergencyContact?.phone,
                        available: resource.emergencyContact?.available,
                    })),
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
     * Report a crisis incident
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async reportCrisis(req, res) {
        try {
            const {
                sessionId,
                crisisLevel,
                description,
                location,
                contactInfo,
            } = req.body;

            if (!sessionId || !crisisLevel) {
                return res.status(400).json({
                    success: false,
                    error: "Session ID and crisis level are required",
                });
            }

            // Find conversation
            const conversation = await Conversation.findOne({ sessionId });
            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    error: "Conversation not found",
                });
            }

            // Update conversation with crisis report
            await conversation.updateCrisisStatus(crisisLevel, {
                action: "crisis_reported",
                notes: `Crisis reported: ${
                    description || "No description provided"
                }`,
            });

            // Log crisis incident
            logger.warn(`Crisis reported for session ${sessionId}:`, {
                crisisLevel,
                description,
                location,
                contactInfo,
                userId: conversation.userId,
            });

            // TODO: In a real implementation, you would:
            // 1. Send alerts to crisis response team
            // 2. Store incident in a separate crisis incidents database
            // 3. Send notifications to emergency contacts
            // 4. Integrate with external crisis response systems

            res.json({
                success: true,
                message: "Crisis incident reported successfully",
                data: {
                    incidentId: `crisis_${Date.now()}`,
                    crisisLevel,
                    reportedAt: new Date(),
                    nextSteps: this.getCrisisNextSteps(crisisLevel),
                },
            });
        } catch (error) {
            logger.error("Error in reportCrisis:", error);
            res.status(500).json({
                success: false,
                error: "Failed to report crisis incident",
            });
        }
    }

    /**
     * Get crisis statistics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCrisisStats(req, res) {
        try {
            const { startDate, endDate } = req.query;

            const filter = { crisisDetected: true };

            if (startDate && endDate) {
                filter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                };
            }

            const stats = await Conversation.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: "$crisisLevel",
                        count: { $sum: 1 },
                        avgCrisisScore: { $avg: "$crisisScore" },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCrises: { $sum: "$count" },
                        crisisLevels: {
                            $push: {
                                level: "$_id",
                                count: "$count",
                                avgScore: "$avgCrisisScore",
                            },
                        },
                    },
                },
            ]);

            const totalCrises = stats[0]?.totalCrises || 0;
            const crisisLevels = stats[0]?.crisisLevels || [];

            res.json({
                success: true,
                data: {
                    totalCrises,
                    crisisLevels,
                    period: {
                        startDate: startDate || "all time",
                        endDate: endDate || "present",
                    },
                },
            });
        } catch (error) {
            logger.error("Error in getCrisisStats:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve crisis statistics",
            });
        }
    }

    /**
     * Get crisis intervention recommendations
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getCrisisRecommendations(req, res) {
        try {
            const { crisisLevel, language = "en" } = req.query;

            if (!crisisLevel) {
                return res.status(400).json({
                    success: false,
                    error: "Crisis level is required",
                });
            }

            const recommendations = this.getCrisisInterventionRecommendations(
                crisisLevel,
                language
            );

            res.json({
                success: true,
                data: {
                    crisisLevel,
                    recommendations,
                    immediateActions: this.getImmediateActions(
                        crisisLevel,
                        language
                    ),
                    resources: await this.getRelevantResources(
                        crisisLevel,
                        language
                    ),
                },
            });
        } catch (error) {
            logger.error("Error in getCrisisRecommendations:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve crisis recommendations",
            });
        }
    }

    /**
     * Get crisis intervention recommendations based on level
     * @param {string} crisisLevel - Crisis level
     * @param {string} language - Language code
     * @returns {Array} - Recommendations
     */
    getCrisisInterventionRecommendations(crisisLevel, language) {
        const recommendations = {
            critical: {
                en: [
                    "Immediately contact emergency services",
                    "Stay with the person if safe to do so",
                    "Remove any means of self-harm if possible",
                    "Call crisis hotline: +234-806-210-0053",
                    "Escalate to mental health professional immediately",
                ],
                pidgin: [
                    "Call emergency services now now",
                    "Stay with the person if e safe",
                    "Remove anything wey fit harm the person",
                    "Call crisis hotline: +234-806-210-0053",
                    "Escalate to mental health doctor immediately",
                ],
                hausa: [
                    "Kira sabis na gaggawa nan da nan",
                    "Zauna tare da mutumin idan yana da aminci",
                    "Cire duk wani abu da zai iya cutar da shi",
                    "Kira lambar gaggawa: +234-806-210-0053",
                    "Kai shi ga likitan lafiyar hankali nan da nan",
                ],
            },
            high: {
                en: [
                    "Contact crisis hotline within 1 hour",
                    "Schedule immediate appointment with mental health professional",
                    "Implement safety planning",
                    "Provide crisis resources and contacts",
                    "Follow up within 24 hours",
                ],
                pidgin: [
                    "Call crisis hotline for 1 hour",
                    "Book appointment with mental health doctor now",
                    "Make safety plan",
                    "Give crisis resources and contacts",
                    "Follow up for 24 hours",
                ],
                hausa: [
                    "Kira lambar gaggawa cikin sa'a 1",
                    "Yi alƙawari da likitan lafiyar hankali nan da nan",
                    "Yi shirin tsaro",
                    "Ba da albarkatun gaggawa da lambobin waya",
                    "Bi diddigin cikin sa'o'i 24",
                ],
            },
            medium: {
                en: [
                    "Schedule appointment with mental health professional within 48 hours",
                    "Provide coping strategies and resources",
                    "Implement regular check-ins",
                    "Connect with support groups",
                    "Monitor for escalation",
                ],
                pidgin: [
                    "Book appointment with mental health doctor for 48 hours",
                    "Give coping strategies and resources",
                    "Do regular check-ins",
                    "Connect with support groups",
                    "Monitor for escalation",
                ],
                hausa: [
                    "Yi alƙawari da likitan lafiyar hankali cikin sa'o'i 48",
                    "Ba da dabaru na jurewa da albarkatu",
                    "Yi bincike na yau da kullum",
                    "Haɗa da ƙungiyoyin tallafi",
                    "Sa ido don haɓakawa",
                ],
            },
            low: {
                en: [
                    "Provide general mental health resources",
                    "Schedule follow-up conversation",
                    "Encourage self-care practices",
                    "Connect with community support",
                    "Monitor for changes",
                ],
                pidgin: [
                    "Give general mental health resources",
                    "Book follow-up conversation",
                    "Encourage self-care practices",
                    "Connect with community support",
                    "Monitor for changes",
                ],
                hausa: [
                    "Ba da albarkatun lafiyar hankali gabaɗaya",
                    "Yi alƙawari don ci gaba da tattaunawa",
                    "Ƙarfafa ayyukan kula da kai",
                    "Haɗa da tallafin al'umma",
                    "Sa ido don canje-canje",
                ],
            },
        };

        return (
            recommendations[crisisLevel]?.[language] ||
            recommendations[crisisLevel]?.en ||
            []
        );
    }

    /**
     * Get immediate actions for crisis level
     * @param {string} crisisLevel - Crisis level
     * @param {string} language - Language code
     * @returns {Array} - Immediate actions
     */
    getImmediateActions(crisisLevel, language) {
        const actions = {
            critical: {
                en: [
                    "Call emergency services: 199 or 112",
                    "Call crisis hotline: +234-806-210-0053",
                    "Stay with the person",
                    "Remove dangerous objects",
                ],
                pidgin: [
                    "Call emergency services: 199 or 112",
                    "Call crisis hotline: +234-806-210-0053",
                    "Stay with the person",
                    "Remove dangerous objects",
                ],
                hausa: [
                    "Kira sabis na gaggawa: 199 ko 112",
                    "Kira lambar gaggawa: +234-806-210-0053",
                    "Zauna tare da mutumin",
                    "Cire abubuwa masu haɗari",
                ],
            },
        };

        return actions[crisisLevel]?.[language] || actions.critical?.en || [];
    }

    /**
     * Get relevant resources for crisis level
     * @param {string} crisisLevel - Crisis level
     * @param {string} language - Language code
     * @returns {Array} - Relevant resources
     */
    async getRelevantResources(crisisLevel, language) {
        const categories = {
            critical: ["emergency", "hotline", "crisis"],
            high: ["crisis", "hotline", "emergency"],
            medium: ["coping", "support", "general"],
            low: ["general", "coping", "meditation"],
        };

        const relevantCategories = categories[crisisLevel] || categories.low;

        const resources = await Resource.find({
            category: { $in: relevantCategories },
            languages: language,
            isActive: true,
        }).limit(5);

        return resources.map((resource) => ({
            id: resource._id,
            title: resource.translations[language]?.title || resource.title,
            description:
                resource.translations[language]?.description ||
                resource.description,
            type: resource.type,
            category: resource.category,
        }));
    }

    /**
     * Get next steps for crisis level
     * @param {string} crisisLevel - Crisis level
     * @returns {Array} - Next steps
     */
    getCrisisNextSteps(crisisLevel) {
        const steps = {
            critical: [
                "Emergency services have been notified",
                "Crisis response team will contact you within 15 minutes",
                "Please stay in a safe location",
                "Keep emergency contacts nearby",
            ],
            high: [
                "Crisis hotline has been contacted",
                "Mental health professional will reach out within 2 hours",
                "Safety planning resources have been provided",
                "Follow-up scheduled for tomorrow",
            ],
            medium: [
                "Appointment with mental health professional scheduled",
                "Coping resources have been provided",
                "Regular check-ins will be conducted",
                "Support group information shared",
            ],
            low: [
                "General mental health resources provided",
                "Follow-up conversation scheduled",
                "Self-care recommendations given",
                "Community support information shared",
            ],
        };

        return steps[crisisLevel] || steps.low;
    }
}

module.exports = new CrisisController();
