import express from "express";
import {
    register,
    verifyEmail,
    resendVerification,
    login,
    refreshAccessToken,
    logout,
    logoutAll,
    forgotPassword,
    resetPassword,
    getLoggedInUser,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Public routes
router.post("/register", register);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.post("/logout-all", authMiddleware, logoutAll);
router.get("/me", authMiddleware, getLoggedInUser);

export default router;
