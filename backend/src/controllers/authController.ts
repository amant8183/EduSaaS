import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { registerSchema, loginSchema } from "../utils/validation";
import { ZodError, ZodIssue } from "zod";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService";

// Token expiry times
const ACCESS_TOKEN_EXPIRY = "15m"; // Short-lived
const REFRESH_TOKEN_EXPIRY = "7d"; // Long-lived
const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const PASSWORD_RESET_EXPIRY = 60 * 60 * 1000; // 1 hour

// Generate tokens
const generateAccessToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};

const generateRefreshToken = (): string => {
    return crypto.randomBytes(40).toString("hex");
};

const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
};

const generateRandomToken = (): string => {
    return crypto.randomBytes(32).toString("hex");
};

export const register = async (req: Request, res: Response) => {
    try {
        // Validate input
        const { name, email, password } = registerSchema.parse(req.body);

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = generateRandomToken();
        const hashedVerificationToken = hashToken(verificationToken);

        // Create user
        await User.create({
            name,
            email,
            passwordHash: hashed,
            refreshTokens: [],
            emailVerified: false,
            verificationToken: hashedVerificationToken,
            verificationTokenExpiry: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY),
        });

        // Send verification email
        try {
            await sendVerificationEmail(email, name, verificationToken);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            // Continue anyway - user can request resend
        }

        return res.status(201).json({
            message: "User created successfully. Please check your email to verify your account."
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.issues.map((e: ZodIssue) => ({ field: e.path.join("."), message: e.message })),
            });
        }
        res.status(500).json({ message: "Server error" });
    }
};

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== "string") {
            return res.status(400).json({ message: "Verification token required" });
        }

        const hashedToken = hashToken(token);

        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        // Mark email as verified
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return res.json({ message: "Email verified successfully. You can now log in." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const resendVerification = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists
            return res.json({ message: "If an account exists, a verification email will be sent." });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Generate new verification token
        const verificationToken = generateRandomToken();
        user.verificationToken = hashToken(verificationToken);
        user.verificationTokenExpiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);
        await user.save();

        try {
            await sendVerificationEmail(email, user.name, verificationToken);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
        }

        return res.json({ message: "If an account exists, a verification email will be sent." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        // Validate input
        const { email, password } = loginSchema.parse(req.body);

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in.",
                needsVerification: true
            });
        }

        // Check password
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken();

        // Store hashed refresh token in DB
        const hashedRefreshToken = hashToken(refreshToken);
        user.refreshTokens.push(hashedRefreshToken);

        // Limit to 5 devices (remove oldest if exceeded)
        if (user.refreshTokens.length > 5) {
            user.refreshTokens = user.refreshTokens.slice(-5);
        }

        await user.save();

        return res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                subscriptionStatus: user.subscriptionStatus,
            },
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.issues.map((e: ZodIssue) => ({ field: e.path.join("."), message: e.message })),
            });
        }
        res.status(500).json({ message: "Server error" });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const user = await User.findOne({ email });

        // Always return same message to prevent email enumeration
        if (!user) {
            return res.json({ message: "If an account exists, a password reset email will be sent." });
        }

        // Generate reset token
        const resetToken = generateRandomToken();
        user.passwordResetToken = hashToken(resetToken);
        user.passwordResetTokenExpiry = new Date(Date.now() + PASSWORD_RESET_EXPIRY);
        await user.save();

        try {
            await sendPasswordResetEmail(email, user.name, resetToken);
        } catch (emailError) {
            console.error("Failed to send password reset email:", emailError);
        }

        return res.json({ message: "If an account exists, a password reset email will be sent." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and new password required" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const hashedToken = hashToken(token);

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        user.passwordHash = await bcrypt.hash(password, 10);
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        // Invalidate all refresh tokens (security: force re-login on all devices)
        user.refreshTokens = [];
        await user.save();

        return res.json({ message: "Password reset successfully. You can now log in." });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }

        // Hash the incoming token to compare with stored hash
        const hashedToken = hashToken(refreshToken);

        // Find user with this refresh token
        const user = await User.findOne({ refreshTokens: hashedToken });
        if (!user) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id.toString());

        return res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token required" });
        }

        // Hash the incoming token
        const hashedToken = hashToken(refreshToken);

        // Remove this refresh token from the user's tokens
        await User.updateOne(
            { refreshTokens: hashedToken },
            { $pull: { refreshTokens: hashedToken } }
        );

        return res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const logoutAll = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Remove all refresh tokens for this user (logout from all devices)
        await User.updateOne(
            { _id: userId },
            { $set: { refreshTokens: [] } }
        );

        return res.json({ message: "Logged out from all devices" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getLoggedInUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User.findById(userId).select("-passwordHash -refreshTokens -verificationToken -passwordResetToken");
        return res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
