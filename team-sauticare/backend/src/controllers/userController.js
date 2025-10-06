const User = require("../models/User");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

class UserController {
    /**
     * Register a new user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async register(req, res) {
        try {
            const {
                username,
                email,
                password,
                preferredLanguage = "en",
                isAnonymous = false,
            } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({
                $or: [{ email }, { username }],
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: "User with this email or username already exists",
                });
            }

            // Create new user
            const user = new User({
                username,
                email,
                password,
                preferredLanguage,
                isAnonymous,
            });

            await user.save();

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
            );

            logger.info(`New user registered: ${username} (${email})`);

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        preferredLanguage: user.preferredLanguage,
                        isAnonymous: user.isAnonymous,
                        createdAt: user.createdAt,
                    },
                    token,
                },
            });
        } catch (error) {
            logger.error("Error in register:", error);
            res.status(500).json({
                success: false,
                error: "Failed to register user",
            });
        }
    }

    /**
     * Login user
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user and include password for comparison
            const user = await User.findOne({ email }).select("+password");

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid credentials",
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: "Invalid credentials",
                });
            }

            // Update last active
            await user.updateLastActive();

            // Generate JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
            );

            logger.info(`User logged in: ${user.username} (${user.email})`);

            res.json({
                success: true,
                message: "Login successful",
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        preferredLanguage: user.preferredLanguage,
                        isAnonymous: user.isAnonymous,
                        lastActive: user.lastActive,
                    },
                    token,
                },
            });
        } catch (error) {
            logger.error("Error in login:", error);
            res.status(500).json({
                success: false,
                error: "Failed to login",
            });
        }
    }

    /**
     * Get user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async getProfile(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId).select("-password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }

            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        preferredLanguage: user.preferredLanguage,
                        isAnonymous: user.isAnonymous,
                        profile: user.profile,
                        mentalHealthHistory: user.mentalHealthHistory,
                        isActive: user.isActive,
                        lastActive: user.lastActive,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    },
                },
            });
        } catch (error) {
            logger.error("Error in getProfile:", error);
            res.status(500).json({
                success: false,
                error: "Failed to retrieve user profile",
            });
        }
    }

    /**
     * Update user profile
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async updateProfile(req, res) {
        try {
            const { userId } = req.params;
            const updateData = req.body;

            // Remove sensitive fields that shouldn't be updated directly
            delete updateData.password;
            delete updateData.email;
            delete updateData.username;

            const user = await User.findByIdAndUpdate(userId, updateData, {
                new: true,
                runValidators: true,
            }).select("-password");

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }

            logger.info(
                `User profile updated: ${user.username} (${user.email})`
            );

            res.json({
                success: true,
                message: "Profile updated successfully",
                data: {
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        preferredLanguage: user.preferredLanguage,
                        isAnonymous: user.isAnonymous,
                        profile: user.profile,
                        mentalHealthHistory: user.mentalHealthHistory,
                        isActive: user.isActive,
                        lastActive: user.lastActive,
                        updatedAt: user.updatedAt,
                    },
                },
            });
        } catch (error) {
            logger.error("Error in updateProfile:", error);
            res.status(500).json({
                success: false,
                error: "Failed to update profile",
            });
        }
    }

    /**
     * Delete user account
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findByIdAndDelete(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: "User not found",
                });
            }

            logger.info(
                `User account deleted: ${user.username} (${user.email})`
            );

            res.json({
                success: true,
                message: "User account deleted successfully",
            });
        } catch (error) {
            logger.error("Error in deleteUser:", error);
            res.status(500).json({
                success: false,
                error: "Failed to delete user account",
            });
        }
    }
}

module.exports = new UserController();
