import api from "./api";
import type { PriceBreakdown } from "../types";

// ===== Types matching backend response =====
export interface PortalFeature {
    id: string;
    name: string;
    description: string;
    price: number;
}

export interface Portal {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    coreFeatures: string[];
    availableFeatures: PortalFeature[];
}

export interface BundleDiscount {
    id: string;
    name: string;
    discount: number;
    description: string;
}

export interface PricingPageData {
    portals: Portal[];
    features: { portalId: string; portalName: string; features: PortalFeature[] }[];
    discounts: BundleDiscount[];
    billingOptions: string[];
    annualSavings: string;
}

export interface CalculatePayload {
    portals: string[];
    features: string[];
    billingCycle: "monthly" | "annual";
}

// ===== API calls =====
export const pricingService = {
    getAll: () =>
        api.get<PricingPageData>("/pricing/all").then((r) => r.data),

    calculate: (payload: CalculatePayload) =>
        api
            .post<{ success: boolean; priceBreakdown: PriceBreakdown }>("/pricing/calculate", payload)
            .then((r) => r.data.priceBreakdown),
};
