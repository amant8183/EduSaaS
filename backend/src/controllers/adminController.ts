import { Request, Response } from "express";
import User from "../models/User";
import Subscription from "../models/Subscription";
import Payment from "../models/Payment";

/**
 * Get dashboard metrics for admin
 */
export const getDashboardMetrics = async (_req: Request, res: Response) => {
    try {
        const [
            totalUsers,
            activeSubscriptions,
            totalRevenue,
            recentPayments,
            usersByStatus,
            portalDistribution,
        ] = await Promise.all([
            User.countDocuments(),
            Subscription.countDocuments({ status: "active" }),
            Payment.aggregate([
                { $match: { status: "success" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Payment.find({ status: "success" })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate("userId", "name email"),
            Subscription.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
            Subscription.aggregate([
                { $unwind: "$portals" },
                { $group: { _id: "$portals", count: { $sum: 1 } } },
            ]),
        ]);

        return res.json({
            metrics: {
                totalUsers,
                activeSubscriptions,
                totalRevenue: totalRevenue[0]?.total || 0,
                subscriptionsByStatus: usersByStatus.reduce((acc: any, item: any) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                portalDistribution: portalDistribution.reduce((acc: any, item: any) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
            },
            recentPayments: recentPayments.map(p => ({
                id: p._id,
                amount: p.amount,
                status: p.status,
                date: p.createdAt,
                user: p.userId,
            })),
        });
    } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get all users with pagination and filters
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const search = req.query.search as string;
        const status = req.query.status as string;

        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (status) {
            query.subscriptionStatus = status;
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select("-passwordHash -refreshTokens -verificationToken -passwordResetToken")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(query),
        ]);

        return res.json({
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasMore: skip + users.length < total,
            },
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get all subscriptions with pagination
 */
export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status as string;

        const query: any = {};
        if (status) {
            query.status = status;
        }

        const [subscriptions, total] = await Promise.all([
            Subscription.find(query)
                .populate("userId", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Subscription.countDocuments(query),
        ]);

        return res.json({
            subscriptions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                hasMore: skip + subscriptions.length < total,
            },
        });
    } catch (err) {
        console.error("Error fetching subscriptions:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get all payments with pagination
 */
export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status as string;

        const query: any = {};
        if (status) {
            query.status = status;
        }

        const [payments, total] = await Promise.all([
            Payment.find(query)
                .populate("userId", "name email")
                .populate("subscriptionId", "portals billingCycle")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Payment.countDocuments(query),
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
        console.error("Error fetching payments:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get single user details
 */
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select("-passwordHash -refreshTokens -verificationToken -passwordResetToken");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const [subscription, payments] = await Promise.all([
            Subscription.findOne({ userId, status: "active" }),
            Payment.find({ userId }).sort({ createdAt: -1 }).limit(10),
        ]);

        return res.json({
            user,
            subscription,
            recentPayments: payments,
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Update user role (promote/demote admin)
 */
export const updateUserRole = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Use 'user' or 'admin'" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select("-passwordHash -refreshTokens");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            success: true,
            message: `User role updated to ${role}`,
            user,
        });
    } catch (err) {
        console.error("Error updating user role:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
