import { Request, Response } from "express";
import crypto from "crypto";
import { razorpay, RAZORPAY_KEY, CURRENCY } from "../config/razorpay";
import { calculatePrice, BillingCycle } from "../config/pricing";
import Order from "../models/Order";
import Payment from "../models/Payment";
import Subscription from "../models/Subscription";
import User from "../models/User";
import { sendPaymentConfirmation } from "../services/emailService";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a new Razorpay order
 */
export const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { portals, features, billingCycle } = req.body;

        // Validate input
        if (!portals || !Array.isArray(portals) || portals.length === 0) {
            return res.status(400).json({ message: "At least one portal must be selected" });
        }

        // Calculate price
        const priceBreakdown = calculatePrice(
            portals,
            features || [],
            (billingCycle as BillingCycle) || "monthly"
        );

        // Convert to paise (Razorpay expects amount in smallest currency unit)
        const amountInPaise = Math.round(priceBreakdown.total * 100);

        // Create Razorpay order
        const receipt = `rcpt_${Date.now()}`; // Max 40 chars
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: CURRENCY,
            receipt,
            notes: {
                userId,
                portals: portals.join(","),
                features: (features || []).join(","),
                billingCycle: billingCycle || "monthly",
            },
        });

        // Save order to database
        const order = await Order.create({
            orderId: razorpayOrder.id,
            razorpayOrderId: razorpayOrder.id,
            userId,
            amount: priceBreakdown.total,
            currency: CURRENCY,
            selectedPortals: portals,
            selectedFeatures: features || [],
            billingCycle: billingCycle || "monthly",
            status: "created",
        });

        return res.json({
            success: true,
            order: {
                id: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: priceBreakdown.total,
                amountInPaise,
                currency: CURRENCY,
                priceBreakdown,
            },
            razorpayKey: RAZORPAY_KEY,
        });
    } catch (err) {
        console.error("Error creating order:", err);
        return res.status(500).json({ message: "Failed to create order" });
    }
};

/**
 * Verify payment and activate subscription
 */
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Missing payment details" });
        }

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // Find the order
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, userId });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "paid") {
            return res.status(400).json({ message: "Payment already processed" });
        }

        // Update order status
        order.status = "paid";
        await order.save();

        // Create payment record
        const payment = await Payment.create({
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            userId,
            amount: order.amount,
            currency: order.currency,
            status: "success",
            razorpaySignature: razorpay_signature,
        });

        // Calculate subscription dates
        const startDate = new Date();
        const endDate = new Date();
        if (order.billingCycle === "annual") {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else {
            endDate.setMonth(endDate.getMonth() + 1);
        }

        // Create or update subscription
        const subscription = await Subscription.create({
            userId,
            orderId: razorpay_order_id,
            portals: order.selectedPortals,
            features: order.selectedFeatures,
            amount: order.amount,
            billingCycle: order.billingCycle,
            startDate,
            endDate,
            status: "active",
        });

        // Update payment with subscription ID
        payment.subscriptionId = subscription._id;
        await payment.save();

        // Update user's subscription status and portals
        await User.findByIdAndUpdate(userId, {
            subscriptionStatus: "active",
            currentSubscriptionId: subscription._id,
            purchasedPortals: order.selectedPortals,
            enabledFeatures: order.selectedFeatures,
        });

        // Get user for email
        const user = await User.findById(userId);
        if (user?.email) {
            try {
                await sendPaymentConfirmation(user.email, user.name, order.amount, order.selectedPortals);
            } catch (emailErr) {
                console.error("Failed to send payment confirmation email:", emailErr);
            }
        }

        return res.json({
            success: true,
            message: "Payment verified and subscription activated",
            subscription: {
                id: subscription._id,
                portals: subscription.portals,
                features: subscription.features,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
                status: subscription.status,
            },
        });
    } catch (err) {
        console.error("Error verifying payment:", err);
        return res.status(500).json({ message: "Payment verification failed" });
    }
};

/**
 * Handle Razorpay webhook events
 */
export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (webhookSecret) {
            // Verify webhook signature
            const signature = req.headers["x-razorpay-signature"] as string;
            const body = JSON.stringify(req.body);
            const expectedSignature = crypto
                .createHmac("sha256", webhookSecret)
                .update(body)
                .digest("hex");

            if (signature !== expectedSignature) {
                return res.status(400).json({ message: "Invalid webhook signature" });
            }
        }

        const event = req.body.event;
        const payload = req.body.payload;

        switch (event) {
            case "payment.captured":
                console.log("Payment captured:", payload.payment.entity.id);
                break;
            case "payment.failed":
                console.log("Payment failed:", payload.payment.entity.id);
                // Update order status to failed
                const failedOrderId = payload.payment.entity.order_id;
                await Order.findOneAndUpdate(
                    { razorpayOrderId: failedOrderId },
                    { status: "failed" }
                );
                break;
            default:
                console.log("Unhandled webhook event:", event);
        }

        return res.json({ received: true });
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json({ message: "Webhook processing failed" });
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

        const payments = await Payment.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("subscriptionId", "portals features billingCycle startDate endDate");

        return res.json({ payments });
    } catch (err) {
        console.error("Error fetching payment history:", err);
        return res.status(500).json({ message: "Failed to fetch payment history" });
    }
};
