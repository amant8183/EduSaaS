import { Request, Response, NextFunction } from "express";
import User from "../models/User";

/**
 * Middleware to check if user has admin role
 * Must be used after authMiddleware
 */
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId).select("role");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        next();
    } catch (err) {
        console.error("Admin middleware error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
