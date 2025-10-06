const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, "Message text is required"],
            maxlength: [2000, "Message cannot exceed 2000 characters"],
        },
        isUser: {
            type: Boolean,
            required: true,
        },
        language: {
            type: String,
            enum: ["en", "pidgin", "hausa"],
            default: "en",
        },
        sentiment: {
            type: String,
            enum: ["positive", "neutral", "negative", "crisis"],
            default: "neutral",
        },
        crisisScore: {
            type: Number,
            min: 0,
            max: 1,
            default: 0,
        },
        aiModel: {
            type: String,
            default: "default",
        },
        metadata: {
            responseTime: Number, // in milliseconds
            confidence: Number, // AI confidence score
            keywords: [String],
            emotions: [String],
        },
    },
    {
        timestamps: true,
    }
);

const conversationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sessionId: {
            type: String,
            required: true,
            unique: true,
        },
        messages: [messageSchema],
        language: {
            type: String,
            enum: ["en", "pidgin", "hausa"],
            default: "en",
        },
        status: {
            type: String,
            enum: ["active", "paused", "ended", "crisis"],
            default: "active",
        },
        crisisDetected: {
            type: Boolean,
            default: false,
        },
        crisisLevel: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            default: "low",
        },
        crisisIntervention: {
            triggered: {
                type: Boolean,
                default: false,
            },
            timestamp: Date,
            action: {
                type: String,
                enum: [
                    "hotline_referral",
                    "resource_provided",
                    "escalated",
                    "resolved",
                ],
            },
            notes: String,
        },
        summary: {
            topics: [String],
            emotions: [String],
            keyConcerns: [String],
            suggestedResources: [String],
        },
        feedback: {
            helpful: Boolean,
            rating: {
                type: Number,
                min: 1,
                max: 5,
            },
            comments: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ sessionId: 1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({ crisisDetected: 1 });
conversationSchema.index({ "messages.createdAt": -1 });

// Virtual for message count
conversationSchema.virtual("messageCount").get(function () {
    return this.messages.length;
});

// Method to add a message
conversationSchema.methods.addMessage = function (messageData) {
    this.messages.push(messageData);
    return this.save();
};

// Method to update crisis status
conversationSchema.methods.updateCrisisStatus = function (
    level,
    intervention = null
) {
    this.crisisDetected = level !== "low";
    this.crisisLevel = level;
    this.status = level === "critical" ? "crisis" : this.status;

    if (intervention) {
        this.crisisIntervention = {
            triggered: true,
            timestamp: new Date(),
            ...intervention,
        };
    }

    return this.save();
};

// Method to end conversation
conversationSchema.methods.endConversation = function () {
    this.status = "ended";
    this.isActive = false;
    return this.save();
};

module.exports = mongoose.model("Conversation", conversationSchema);
