import api from "./api";
import type { PriceBreakdown } from "../types";

// ===== Types =====
export interface CreateOrderPayload {
    portals: string[];
    features: string[];
    billingCycle: "monthly" | "annual";
}

export interface CreateOrderResponse {
    success: boolean;
    order: {
        id: string;
        razorpayOrderId: string;
        amount: number;
        amountInPaise: number;
        currency: string;
        priceBreakdown: PriceBreakdown;
    };
    razorpayKey: string;
}

export interface VerifyPaymentPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    subscription: {
        id: string;
        portals: string[];
        features: string[];
        startDate: string;
        endDate: string;
        status: string;
    };
}

// ===== API calls =====
export const paymentService = {
    createOrder: (payload: CreateOrderPayload) =>
        api.post<CreateOrderResponse>("/payment/create-order", payload).then((r) => r.data),

    verifyPayment: (payload: VerifyPaymentPayload) =>
        api.post<VerifyPaymentResponse>("/payment/verify", payload).then((r) => r.data),
};
