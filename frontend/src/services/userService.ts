import api from "./api";
import type { Payment } from "../types";

// ===== Response types =====
export interface DashboardSummary {
    user: { name: string; email: string; subscriptionStatus: string };
    subscription: {
        portals: string[];
        features: string[];
        billingCycle: "monthly" | "annual";
        startDate: string;
        endDate: string;
        status: string;
        daysRemaining: number;
    } | null;
    recentPayments: { id: string; amount: number; status: string; date: string }[];
}

export interface SubscriptionDetail {
    hasSubscription: boolean;
    subscription: {
        id: string;
        portals: string[];
        features: string[];
        amount: number;
        billingCycle: "monthly" | "annual";
        startDate: string;
        endDate: string;
        status: string;
        autoRenew: boolean;
        daysRemaining: number;
    } | null;
    message?: string;
}

export interface PaymentHistoryResponse {
    payments: Payment[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasMore: boolean;
    };
}

// ===== API calls =====
export const userService = {
    getDashboard: () =>
        api.get<DashboardSummary>("/user/dashboard").then((r) => r.data),

    getSubscription: () =>
        api.get<SubscriptionDetail>("/user/subscription").then((r) => r.data),

    getPaymentHistory: (page = 1, limit = 10) =>
        api
            .get<PaymentHistoryResponse>(`/user/payments?page=${page}&limit=${limit}`)
            .then((r) => r.data),

    toggleAutoRenew: () =>
        api
            .patch<{ success: boolean; autoRenew: boolean; message: string }>(
                "/user/subscription/auto-renew"
            )
            .then((r) => r.data),

    cancelSubscription: () =>
        api
            .post<{ success: boolean; message: string; endDate: string }>(
                "/user/subscription/cancel"
            )
            .then((r) => r.data),
};
