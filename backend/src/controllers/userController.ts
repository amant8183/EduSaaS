import { Request, Response } from "express";
import User from "../models/User";
import Subscription from "../models/Subscription";
import Payment from "../models/Payment";

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-passwordHash -refreshTokens -verificationToken -passwordResetToken");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user });
    } catch (err) {
        console.error("Error fetching profile:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get user's active subscription details
 */
export const getSubscription = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const subscription = await Subscription.findOne({ userId, status: "active" })
            .sort({ createdAt: -1 });

        if (!subscription) {
            return res.json({
                hasSubscription: false,
                subscription: null,
                message: "No active subscription"
            });
        }

        // Check if subscription has expired
        if (subscription.endDate < new Date()) {
            subscription.status = "inactive";
            await subscription.save();

            // Update user status
            await User.findByIdAndUpdate(userId, { subscriptionStatus: "inactive" });

            return res.json({
                hasSubscription: false,
                subscription: null,
                message: "Subscription has expired"
            });
        }

        return res.json({
            hasSubscription: true,
            subscription: {
                id: subscription._id,
                portals: subscription.portals,
                features: subscription.features,
                amount: subscription.amount,
                billingCycle: subscription.billingCycle,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
                status: subscription.status,
                autoRenew: subscription.autoRenew,
                daysRemaining: Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            },
        });
    } catch (err) {
        console.error("Error fetching subscription:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get user's payment history
 */
export const getPaymentHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [payments, total] = await Promise.all([
            Payment.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("subscriptionId", "portals features billingCycle"),
            Payment.countDocuments({ userId }),
        ]);

        return res.json({
            payments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasMore: skip + payments.length < total,
            },
        });
    } catch (err) {
        console.error("Error fetching payment history:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Toggle auto-renew for subscription
 */
export const toggleAutoRenew = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const subscription = await Subscription.findOne({ userId, status: "active" });
        if (!subscription) {
            return res.status(404).json({ message: "No active subscription found" });
        }

        subscription.autoRenew = !subscription.autoRenew;
        await subscription.save();

        return res.json({
            success: true,
            autoRenew: subscription.autoRenew,
            message: subscription.autoRenew ? "Auto-renewal enabled" : "Auto-renewal disabled",
        });
    } catch (err) {
        console.error("Error toggling auto-renew:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const subscription = await Subscription.findOne({ userId, status: "active" });
        if (!subscription) {
            return res.status(404).json({ message: "No active subscription found" });
        }

        // Cancel the subscription (effective at end of billing period)
        subscription.status = "cancelled";
        subscription.autoRenew = false;
        await subscription.save();

        // Update user status
        await User.findByIdAndUpdate(userId, { subscriptionStatus: "cancelled" });

        return res.json({
            success: true,
            message: "Subscription cancelled. You can continue to use the service until " + subscription.endDate.toLocaleDateString(),
            endDate: subscription.endDate,
        });
    } catch (err) {
        console.error("Error cancelling subscription:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get user dashboard summary
 */
export const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const [user, subscription, recentPayments] = await Promise.all([
            User.findById(userId).select("name email subscriptionStatus purchasedPortals enabledFeatures"),
            Subscription.findOne({ userId, status: "active" }).sort({ createdAt: -1 }),
            Payment.find({ userId, status: "success" }).sort({ createdAt: -1 }).limit(5),
        ]);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            user: {
                name: user.name,
                email: user.email,
                subscriptionStatus: user.subscriptionStatus,
            },
            subscription: subscription ? {
                portals: subscription.portals,
                features: subscription.features,
                billingCycle: subscription.billingCycle,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
                status: subscription.status,
                daysRemaining: Math.max(0, Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
            } : null,
            recentPayments: recentPayments.map(p => ({
                id: p._id,
                amount: p.amount,
                status: p.status,
                date: p.createdAt,
            })),
        });
    } catch (err) {
        console.error("Error fetching dashboard summary:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
