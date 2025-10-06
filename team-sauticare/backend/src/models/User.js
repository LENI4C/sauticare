const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters long"],
            maxlength: [30, "Username cannot exceed 30 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please enter a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },
        preferredLanguage: {
            type: String,
            enum: ["en", "pidgin", "hausa"],
            default: "en",
        },
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        profile: {
            age: {
                type: Number,
                min: [13, "Age must be at least 13"],
                max: [120, "Age cannot exceed 120"],
            },
            gender: {
                type: String,
                enum: ["male", "female", "other", "prefer-not-to-say"],
            },
            location: {
                type: String,
                maxlength: [100, "Location cannot exceed 100 characters"],
            },
        },
        mentalHealthHistory: {
            hasHistory: {
                type: Boolean,
                default: false,
            },
            conditions: [
                {
                    type: String,
                    enum: ["anxiety", "depression", "ptsd", "bipolar", "other"],
                },
            ],
            isReceivingTreatment: {
                type: Boolean,
                default: false,
            },
        },
        crisisHistory: [
            {
                date: {
                    type: Date,
                    default: Date.now,
                },
                severity: {
                    type: String,
                    enum: ["low", "medium", "high", "critical"],
                },
                resolved: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        lastActive: {
            type: Date,
            default: Date.now,
        },
        moodTracking: {
            currentMood: {
                type: String,
                enum: [
                    "excited",
                    "happy",
                    "calm",
                    "neutral",
                    "anxious",
                    "sad",
                    "angry",
                    "grateful",
                ],
                default: "neutral",
            },
            moodHistory: [
                {
                    mood: {
                        type: String,
                        enum: [
                            "excited",
                            "happy",
                            "calm",
                            "neutral",
                            "anxious",
                            "sad",
                            "angry",
                            "grateful",
                        ],
                    },
                    timestamp: {
                        type: Date,
                        default: Date.now,
                    },
                    context: String, // Optional context about what triggered the mood
                },
            ],
            lastMoodUpdate: {
                type: Date,
                default: Date.now,
            },
        },
        preferences: {
            theme: {
                type: String,
                enum: ["light", "dark", "auto"],
                default: "auto",
            },
            notifications: {
                enabled: {
                    type: Boolean,
                    default: true,
                },
                crisisAlerts: {
                    type: Boolean,
                    default: true,
                },
                moodReminders: {
                    type: Boolean,
                    default: false,
                },
            },
            accessibility: {
                reducedMotion: {
                    type: Boolean,
                    default: false,
                },
                highContrast: {
                    type: Boolean,
                    default: false,
                },
                fontSize: {
                    type: String,
                    enum: ["small", "medium", "large"],
                    default: "medium",
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ lastActive: -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Update last active timestamp
userSchema.methods.updateLastActive = function () {
    this.lastActive = new Date();
    return this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model("User", userSchema);
