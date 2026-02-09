import express from "express";
import { createOrder, verifyPayment, handleWebhook, getPaymentHistory } from "../controllers/paymentController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Protected routes (require authentication)
router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);
router.get("/history", authMiddleware, getPaymentHistory);

// Webhook route (no auth - verified via signature)
router.post("/webhook", handleWebhook);

export default router;
