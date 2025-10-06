const Conversation = require("../models/Conversation");
const User = require("../models/User");
const chatbotService = require("../../../ai/src/services/chatbotService");
const logger = require("../utils/logger");

class ChatController {
    /**
     * Send a message and get AI response
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async sendMessage(req, res) {
        try {
            const { message, sessionId, userId, mood } = req.body;

            if (!message || message.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: "Message is required",
                });
            }

            // Find or create conversation
            let conversation = await Conversation.findOne({ sessionId });

            if (!conversation) {
                conversation = new Conversation({
                    sessionId,
                    userId: userId || null,
                    messages: [],
                });
            }

            // Add user message to conversation
            const userMessage = {
                text: message,
                isUser: true,
                timestamp: new Date(),
            };

            await conversation.addMessage(userMessage);

            // Get conversation history for context
            const recentMessages = conversation.messages.slice(-10); // Last 10 messages
            const conversationHistory = recentMessages
                .map((msg) => `${msg.isUser ? "User" : "Bot"}: ${msg.text}`)
                .join("\n");

            // Generate AI response
            const aiResponse = await chatbotService.generateResponse(
                message,
                conversationHistory,
                userId
            );

            // Add bot response to conversation
            const botMessage = {
                text: aiResponse.message,
                isUser: false,
                language: aiResponse.language,
                sentiment: aiResponse.sentiment,
                crisisScore: aiResponse.crisisScore || 0,
                metadata: aiResponse.metadata,
            };

            await conversation.addMessage(botMessage);

            // Update conversation status if crisis detected
            if (aiResponse.crisisDetected) {
                await conversation.updateCrisisStatus(aiResponse.crisisLevel, {
                    action: "crisis_detected",
                    notes: `Crisis level: ${aiResponse.crisisLevel}, Score: ${aiResponse.crisisScore}`,
                });
            }

            // Update user's last active time and mood if userId provided
            if (userId) {
                const updateData = {
                    lastActive: new Date(),
                };

                // Update mood if provided
                if (mood) {
                    updateData["moodTracking.currentMood"] = mood;
                    updateData["moodTracking.lastMoodUpdate"] = new Date();

                    // Add to mood history
                    updateData["$push"] = {
                        "moodTracking.moodHistory": {
                            mood: mood,
                            timestamp: new Date(),
                            context: "User selected mood during conversation",
                        },
                    };
                }

                await User.findByIdAndUpdate(userId, updateData);
            }

            logger.info(
                `Message processed for session ${sessionId}, crisis detected: ${aiResponse.crisisDetected}`
            );

            res.json({
                success: true,
                data: {
                    message: aiResponse.message,
                    language: aiResponse.language,
                    sentiment: aiResponse.sentiment,
                    crisisDetected: aiResponse.crisisDetected,
                    crisisLevel: aiResponse.crisisLevel,
                    recommendations: aiResponse.recommendations,
                    sessionId: conversation.sessionId,
                    messageId: botMessage._id,
                    timestamp: botMessage.timestamp,
                },
            });
        } catch (error) {
            logger.error("Error in sendMessage:", error);
            res.status(500).json({
                success: false,
                error: "Failed to process message",
            });
        }
    }

    /**
     * Get conversation history
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getConversation(req, res) {
        try {
            const { sessionId } = req.params;
            const { limit = 50, offset = 0 } = req.query;

            const conversation = await Conversation.findOne({ sessionId })
                .select(
                    "messages sessionId status crisisDetected crisisLevel createdAt updatedAt"
                )
                .lean();

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    error: "Conversation not found",
                });
            }

            // Paginate messages
            const messages = conversation.messages
                .slice(offset, offset + parseInt(limit))
                .map((msg) => ({
                    id: msg._id,
                    text: msg.text,
                    isUser: msg.isUser,
                    language: msg.language,
                    sentiment: msg.sentiment,
                    timestamp: msg.timestamp,
                }));

            res.json({
                success: true,
                data: {
                    sessionId: conversation.sessionId,
                    status: conversation.status,
                    crisisDetected: conversation.crisisDetected,
                    crisisLevel: conversation.crisisLevel,
                    messages,
                    totalMessages: conversation.messages.length,
                    createdAt: conversation.createdAt,
                    updatedAt: conversation.updatedAt,
                },
            });
        } catch (error) {
            logger.error("Error in getConversation:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve conversation",
            });
        }
    }

    /**
     * Start a new conversation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async startConversation(req, res) {
        try {
            const { userId, preferredLanguage = "en" } = req.body;
            const sessionId = `session_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`;

            const conversation = new Conversation({
                sessionId,
                userId: userId || null,
                language: preferredLanguage,
                messages: [],
            });

            await conversation.save();

            // Generate welcome message
            const welcomeResponse = await chatbotService.generateResponse(
                "Hello",
                "",
                userId
            );

            // Add welcome message
            const welcomeMessage = {
                text: welcomeResponse.message,
                isUser: false,
                language: welcomeResponse.language,
                sentiment: "neutral",
            };

            await conversation.addMessage(welcomeMessage);

            logger.info(`New conversation started: ${sessionId}`);

            res.status(201).json({
                success: true,
                data: {
                    sessionId: conversation.sessionId,
                    welcomeMessage: welcomeResponse.message,
                    language: welcomeResponse.language,
                    createdAt: conversation.createdAt,
                },
            });
        } catch (error) {
            logger.error("Error in startConversation:", error);
            res.status(500).json({
                success: false,
                error: "Failed to start conversation",
            });
        }
    }

    /**
     * End a conversation
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async endConversation(req, res) {
        try {
            const { sessionId } = req.params;
            const { feedback } = req.body;

            const conversation = await Conversation.findOne({ sessionId });

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    error: "Conversation not found",
                });
            }

            // Update feedback if provided
            if (feedback) {
                conversation.feedback = feedback;
            }

            // End conversation
            await conversation.endConversation();

            logger.info(`Conversation ended: ${sessionId}`);

            res.json({
                success: true,
                message: "Conversation ended successfully",
            });
        } catch (error) {
            logger.error("Error in endConversation:", error);
            res.status(500).json({
                success: false,
                error: "Failed to end conversation",
            });
        }
    }

    /**
     * Get conversation analytics
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getConversationAnalytics(req, res) {
        try {
            const { sessionId } = req.params;

            const conversation = await Conversation.findOne({ sessionId })
                .select(
                    "messages crisisDetected crisisLevel summary createdAt updatedAt"
                )
                .lean();

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    error: "Conversation not found",
                });
            }

            // Calculate analytics
            const analytics = {
                totalMessages: conversation.messages.length,
                userMessages: conversation.messages.filter((msg) => msg.isUser)
                    .length,
                botMessages: conversation.messages.filter((msg) => !msg.isUser)
                    .length,
                crisisDetected: conversation.crisisDetected,
                crisisLevel: conversation.crisisLevel,
                duration: conversation.updatedAt - conversation.createdAt,
                languages: [
                    ...new Set(
                        conversation.messages.map((msg) => msg.language)
                    ),
                ],
                sentiments: conversation.messages.reduce((acc, msg) => {
                    acc[msg.sentiment] = (acc[msg.sentiment] || 0) + 1;
                    return acc;
                }, {}),
                summary: conversation.summary,
            };

            res.json({
                success: true,
                data: analytics,
            });
        } catch (error) {
            logger.error("Error in getConversationAnalytics:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve analytics",
            });
        }
    }

    /**
     * Update user mood
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateMood(req, res) {
        try {
            const { userId } = req.params;
            const { mood, context } = req.body;

            if (!mood) {
                return res.status(400).json({
                    success: false,
                    error: "Mood is required",
                });
            }

            const validMoods = [
                "excited",
                "happy",
                "calm",
                "neutral",
                "anxious",
                "sad",
                "angry",
                "grateful",
            ];
            if (!validMoods.includes(mood)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid mood value",
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }

            // Update current mood
            user.moodTracking.currentMood = mood;
            user.moodTracking.lastMoodUpdate = new Date();

            // Add to mood history
            user.moodTracking.moodHistory.push({
                mood: mood,
                timestamp: new Date(),
                context: context || "User updated mood",
            });

            // Keep only last 30 mood entries
            if (user.moodTracking.moodHistory.length > 30) {
                user.moodTracking.moodHistory =
                    user.moodTracking.moodHistory.slice(-30);
            }

            await user.save();

            logger.info(`Mood updated for user ${userId}: ${mood}`);

            res.json({
                success: true,
                data: {
                    currentMood: user.moodTracking.currentMood,
                    lastMoodUpdate: user.moodTracking.lastMoodUpdate,
                    moodHistory: user.moodTracking.moodHistory.slice(-10), // Last 10 entries
                },
            });
        } catch (error) {
            logger.error("Error in updateMood:", error);
            res.status(500).json({
                success: false,
                error: "Failed to update mood",
            });
        }
    }

    /**
     * Get user mood history
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getMoodHistory(req, res) {
        try {
            const { userId } = req.params;
            const { limit = 30 } = req.query;

            const user = await User.findById(userId)
                .select("moodTracking")
                .lean();

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }

            const moodHistory = user.moodTracking.moodHistory
                .slice(-parseInt(limit))
                .reverse(); // Most recent first

            res.json({
                success: true,
                data: {
                    currentMood: user.moodTracking.currentMood,
                    lastMoodUpdate: user.moodTracking.lastMoodUpdate,
                    moodHistory: moodHistory,
                },
            });
        } catch (error) {
            logger.error("Error in getMoodHistory:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve mood history",
            });
        }
    }
}

module.exports = new ChatController();
