// ===== User =====
export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    subscriptionStatus: "active" | "inactive";
    purchasedPortals: string[];
    enabledFeatures: string[];
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

// ===== Auth =====
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

// ===== Subscription =====
export interface Subscription {
    _id: string;
    userId: string;
    portals: string[];
    features: string[];
    amount: number;
    billingCycle: "monthly" | "annual";
    startDate: string;
    endDate: string;
    status: "active" | "inactive" | "cancelled";
    autoRenew: boolean;
    daysRemaining?: number;
    createdAt: string;
}

// ===== Payment =====
export interface Payment {
    _id: string;
    paymentId: string;
    orderId: string;
    userId: string | { name: string; email: string };
    subscriptionId?: string;
    amount: number;
    currency: string;
    status: "success" | "failed" | "pending";
    method?: string;
    createdAt: string;
}

// ===== Pricing =====
export interface PortalInfo {
    name: string;
    displayName: string;
    basePrice: number;
    coreFeatures: string[];
}

export interface FeatureInfo {
    name: string;
    displayName: string;
    price: number;
    portal: string;
}

export interface PriceBreakdown {
    basePrice: number;
    addOnPrice: number;
    subtotal: number;
    discountPercentage: number;
    discountAmount: number;
    annualMultiplier?: number;
    total: number;
    billingCycle: "monthly" | "annual";
    portals?: { id: string; name: string; price: number }[];
    features?: { id: string; name: string; price: number }[];
}

// ===== Order =====
export interface OrderResponse {
    orderId: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    key: string;
}

// ===== API =====
export interface ApiError {
    message: string;
    errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasMore: boolean;
    };
    [key: string]: T[] | PaginatedResponse<T>["pagination"];
}
