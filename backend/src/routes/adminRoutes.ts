import express from "express";
import { authMiddleware } from "../middleware/auth";
import { adminMiddleware } from "../middleware/adminAuth";
import {
    getDashboardMetrics,
    getAllUsers,
    getAllSubscriptions,
    getAllPayments,
    getUserById,
    updateUserRole,
    getPricingConfig,
    updatePricingConfig,
} from "../controllers/adminController";

const router = express.Router();

// All routes require auth + admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", getDashboardMetrics);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId/role", updateUserRole);
router.get("/subscriptions", getAllSubscriptions);
router.get("/payments", getAllPayments);
router.get("/pricing", getPricingConfig);
router.put("/pricing", updatePricingConfig);

export default router;

