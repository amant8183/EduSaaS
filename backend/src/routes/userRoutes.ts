import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
    getProfile,
    getSubscription,
    getPaymentHistory,
    toggleAutoRenew,
    cancelSubscription,
    getDashboardSummary,
} from "../controllers/userController";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/profile", getProfile);
router.get("/subscription", getSubscription);
router.get("/payments", getPaymentHistory);
router.patch("/subscription/auto-renew", toggleAutoRenew);
router.post("/subscription/cancel", cancelSubscription);
router.get("/dashboard", getDashboardSummary);

export default router;
