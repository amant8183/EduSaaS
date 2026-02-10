import api from "./api";
import type { User, Payment } from "../types";

// ===== Response types =====
export interface AdminMetrics {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    subscriptionsByStatus: Record<string, number>;
    portalDistribution: Record<string, number>;
}

export interface AdminDashboardResponse {
    metrics: AdminMetrics;
    recentPayments: {
        id: string;
        amount: number;
        status: string;
        date: string;
        user: { name: string; email: string } | string;
    }[];
}

export interface Paginated<T> {
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasMore: boolean;
    };
    [key: string]: T[] | Paginated<T>["pagination"];
}

export interface AdminSubscription {
    _id: string;
    userId: { _id: string; name: string; email: string } | string;
    portals: string[];
    features: string[];
    amount: number;
    billingCycle: "monthly" | "annual";
    startDate: string;
    endDate: string;
    status: string;
    autoRenew: boolean;
    createdAt: string;
}

// ===== API calls =====
export const adminService = {
    getDashboard: () =>
        api.get<AdminDashboardResponse>("/admin/dashboard").then((r) => r.data),

    getUsers: (page = 1, limit = 20, search = "", status = "") => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search) params.set("search", search);
        if (status) params.set("status", status);
        return api
            .get<{ users: User[]; pagination: Paginated<User>["pagination"] }>(
                `/admin/users?${params}`
            )
            .then((r) => r.data);
    },

    getSubscriptions: (page = 1, limit = 20, status = "") => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.set("status", status);
        return api
            .get<{ subscriptions: AdminSubscription[]; pagination: Paginated<AdminSubscription>["pagination"] }>(
                `/admin/subscriptions?${params}`
            )
            .then((r) => r.data);
    },

    getPayments: (page = 1, limit = 20, status = "") => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.set("status", status);
        return api
            .get<{ payments: Payment[]; pagination: Paginated<Payment>["pagination"] }>(
                `/admin/payments?${params}`
            )
            .then((r) => r.data);
    },

    updateUserRole: (userId: string, role: "user" | "admin") =>
        api.patch<{ success: boolean; message: string }>(`/admin/users/${userId}/role`, { role }).then((r) => r.data),
};
