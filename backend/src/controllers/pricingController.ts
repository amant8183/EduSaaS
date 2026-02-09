import { Request, Response } from "express";
import {
    calculatePrice,
    getAvailablePortals,
    getAvailableFeatures,
    getBundleDiscountInfo,
    VALID_PORTALS,
    VALID_BILLING_CYCLES
} from "../config/pricing";

/**
 * Get all available portals with pricing information
 */
export const getPortals = (_req: Request, res: Response) => {
    try {
        const portals = getAvailablePortals();
        return res.json({ portals });
    } catch (err) {
        console.error("Error fetching portals:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get all available features grouped by portal
 */
export const getFeatures = (_req: Request, res: Response) => {
    try {
        const features = getAvailableFeatures();
        return res.json({ features });
    } catch (err) {
        console.error("Error fetching features:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Calculate price based on selected portals and features
 */
export const calculateTotalPrice = (req: Request, res: Response) => {
    try {
        const { portals, features, billingCycle } = req.body;

        // Validate portals
        if (!portals || !Array.isArray(portals) || portals.length === 0) {
            return res.status(400).json({ message: "At least one portal must be selected" });
        }

        const invalidPortals = portals.filter((p: string) => !(VALID_PORTALS as readonly string[]).includes(p));
        if (invalidPortals.length > 0) {
            return res.status(400).json({ message: `Invalid portals: ${invalidPortals.join(", ")}` });
        }

        // Validate billing cycle
        if (billingCycle && !VALID_BILLING_CYCLES.includes(billingCycle)) {
            return res.status(400).json({ message: "Invalid billing cycle. Use 'monthly' or 'annual'" });
        }

        const priceBreakdown = calculatePrice(
            portals,
            features || [],
            billingCycle || "monthly"
        );

        return res.json({ success: true, priceBreakdown });
    } catch (err) {
        console.error("Error calculating price:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get bundle discount information
 */
export const getBundleDiscounts = (_req: Request, res: Response) => {
    try {
        return res.json({ discounts: getBundleDiscountInfo() });
    } catch (err) {
        console.error("Error fetching bundle discounts:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get complete pricing page data (portals, features, discounts)
 */
export const getPricingPageData = (_req: Request, res: Response) => {
    try {
        return res.json({
            portals: getAvailablePortals(),
            features: getAvailableFeatures(),
            discounts: getBundleDiscountInfo(),
            billingOptions: VALID_BILLING_CYCLES,
            annualSavings: "2 months free with annual billing",
        });
    } catch (err) {
        console.error("Error fetching pricing page data:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
