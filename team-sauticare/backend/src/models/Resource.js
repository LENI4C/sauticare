const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Resource title is required"],
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Resource description is required"],
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        content: {
            type: String,
            required: [true, "Resource content is required"],
        },
        type: {
            type: String,
            enum: [
                "article",
                "video",
                "audio",
                "exercise",
                "hotline",
                "emergency",
                "tool",
            ],
            required: true,
        },
        category: {
            type: String,
            enum: [
                "anxiety",
                "depression",
                "stress",
                "trauma",
                "crisis",
                "general",
                "coping",
                "meditation",
            ],
            required: true,
        },
        languages: [
            {
                type: String,
                enum: ["en", "pidgin", "hausa"],
                required: true,
            },
        ],
        translations: {
            en: {
                title: String,
                description: String,
                content: String,
            },
            pidgin: {
                title: String,
                description: String,
                content: String,
            },
            hausa: {
                title: String,
                description: String,
                content: String,
            },
        },
        metadata: {
            duration: Number, // in minutes for videos/audio
            difficulty: {
                type: String,
                enum: ["beginner", "intermediate", "advanced"],
                default: "beginner",
            },
            ageGroup: {
                type: String,
                enum: ["teens", "adults", "seniors", "all"],
                default: "all",
            },
            tags: [String],
            author: String,
            source: String,
            lastUpdated: Date,
        },
        accessibility: {
            hasSubtitles: {
                type: Boolean,
                default: false,
            },
            hasAudioDescription: {
                type: Boolean,
                default: false,
            },
            isTextBased: {
                type: Boolean,
                default: true,
            },
        },
        crisisRelevant: {
            type: Boolean,
            default: false,
        },
        emergencyContact: {
            name: String,
            phone: String,
            email: String,
            available: {
                type: String,
                enum: ["24/7", "business-hours", "weekdays", "specific-hours"],
            },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        usageCount: {
            type: Number,
            default: 0,
        },
        rating: {
            average: {
                type: Number,
                min: 1,
                max: 5,
                default: 0,
            },
            count: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
resourceSchema.index({ type: 1, category: 1 });
resourceSchema.index({ languages: 1 });
resourceSchema.index({ "metadata.tags": 1 });
resourceSchema.index({ crisisRelevant: 1 });
resourceSchema.index({ isActive: 1 });
resourceSchema.index({ "rating.average": -1 });

// Method to increment usage count
resourceSchema.methods.incrementUsage = function () {
    this.usageCount += 1;
    return this.save();
};

// Method to update rating
resourceSchema.methods.updateRating = function (newRating) {
    const totalRating = this.rating.average * this.rating.count + newRating;
    this.rating.count += 1;
    this.rating.average = totalRating / this.rating.count;
    return this.save();
};

// Static method to get resources by language and category
resourceSchema.statics.getByLanguageAndCategory = function (
    language,
    category,
    limit = 10
) {
    return this.find({
        languages: language,
        category: category,
        isActive: true,
    })
        .sort({ "rating.average": -1, usageCount: -1 })
        .limit(limit);
};

// Static method to get crisis resources
resourceSchema.statics.getCrisisResources = function (language) {
    return this.find({
        languages: language,
        crisisRelevant: true,
        isActive: true,
    }).sort({ "rating.average": -1 });
};

module.exports = mongoose.model("Resource", resourceSchema);
