import { useState, useCallback } from "react";
import { paymentService, type CreateOrderPayload } from "../services/paymentService";
import { useToast } from "./useToast";
import { useAuth } from "./useAuth";

// Razorpay Checkout types
interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    }) => void;
    prefill?: { name?: string; email?: string };
    theme?: { color?: string };
    modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

export function useRazorpay() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { user, refreshUser } = useAuth();

    // Load Razorpay script dynamically
    const loadScript = useCallback((): Promise<boolean> => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }, []);

    // Start checkout flow
    const checkout = useCallback(
        async (payload: CreateOrderPayload): Promise<boolean> => {
            setLoading(true);

            try {
                // 1. Load Razorpay SDK
                const loaded = await loadScript();
                if (!loaded) {
                    showToast("Failed to load payment gateway. Please try again.", "error");
                    setLoading(false);
                    return false;
                }

                // 2. Create order on backend
                const { order, razorpayKey } = await paymentService.createOrder(payload);

                // 3. Open Razorpay Checkout
                return await new Promise<boolean>((resolve) => {
                    const options: RazorpayOptions = {
                        key: razorpayKey,
                        amount: order.amountInPaise,
                        currency: order.currency,
                        name: "EduSaaS",
                        description: `${payload.portals.length} Portal(s) — ${payload.billingCycle} plan`,
                        order_id: order.razorpayOrderId,
                        handler: async (response) => {
                            try {
                                // 4. Verify payment on backend
                                await paymentService.verifyPayment({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                });

                                showToast("Payment successful! Your subscription is active.", "success");

                                // Refresh user to get updated subscription status
                                if (refreshUser) await refreshUser();

                                resolve(true);
                            } catch {
                                showToast("Payment verification failed. Contact support.", "error");
                                resolve(false);
                            } finally {
                                setLoading(false);
                            }
                        },
                        prefill: {
                            name: user?.name || "",
                            email: user?.email || "",
                        },
                        theme: { color: "#7C5CFC" },
                        modal: {
                            ondismiss: () => {
                                setLoading(false);
                                resolve(false);
                            },
                        },
                    };

                    const rzp = new window.Razorpay(options);
                    rzp.on("payment.failed", (response) => {
                        showToast(response.error.description || "Payment failed.", "error");
                        setLoading(false);
                        resolve(false);
                    });
                    rzp.open();
                });
            } catch {
                showToast("Failed to initiate payment. Please try again.", "error");
                setLoading(false);
                return false;
            }
        },
        [loadScript, showToast, user, refreshUser]
    );

    return { checkout, loading };
}
