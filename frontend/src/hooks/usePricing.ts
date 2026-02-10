import { useState, useEffect, useCallback } from "react";
import {
    pricingService,
    type PricingPageData,
} from "../services/pricingService";
import type { PriceBreakdown } from "../types";

export function usePricing() {
    const [data, setData] = useState<PricingPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedPortals, setSelectedPortals] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
    const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
    const [calculating, setCalculating] = useState(false);

    // Fetch pricing data on mount
    useEffect(() => {
        pricingService
            .getAll()
            .then(setData)
            .catch(() => setError("Failed to load pricing data"))
            .finally(() => setLoading(false));
    }, []);

    // Recalculate when selection changes
    const recalculate = useCallback(async () => {
        if (selectedPortals.length === 0) {
            setPriceBreakdown(null);
            return;
        }

        setCalculating(true);
        try {
            // Filter features to only those belonging to selected portals
            const validFeatures = selectedFeatures.filter((fId) => {
                if (!data) return false;
                return data.portals.some(
                    (p) =>
                        selectedPortals.includes(p.id) &&
                        p.availableFeatures.some((f) => f.id === fId)
                );
            });

            const breakdown = await pricingService.calculate({
                portals: selectedPortals,
                features: validFeatures,
                billingCycle,
            });
            setPriceBreakdown(breakdown);
        } catch {
            // Silent — keep previous breakdown
        } finally {
            setCalculating(false);
        }
    }, [selectedPortals, selectedFeatures, billingCycle, data]);

    useEffect(() => {
        recalculate();
    }, [recalculate]);

    // Toggle a portal
    const togglePortal = useCallback(
        (portalId: string) => {
            setSelectedPortals((prev) => {
                const next = prev.includes(portalId)
                    ? prev.filter((p) => p !== portalId)
                    : [...prev, portalId];

                // Remove features belonging to deselected portals
                if (!next.includes(portalId) && data) {
                    const portal = data.portals.find((p) => p.id === portalId);
                    if (portal) {
                        const featureIds = portal.availableFeatures.map((f) => f.id);
                        setSelectedFeatures((prev) =>
                            prev.filter((f) => !featureIds.includes(f))
                        );
                    }
                }
                return next;
            });
        },
        [data]
    );

    // Toggle a feature
    const toggleFeature = useCallback((featureId: string) => {
        setSelectedFeatures((prev) =>
            prev.includes(featureId)
                ? prev.filter((f) => f !== featureId)
                : [...prev, featureId]
        );
    }, []);

    return {
        data,
        loading,
        error,
        selectedPortals,
        selectedFeatures,
        billingCycle,
        setBillingCycle,
        priceBreakdown,
        calculating,
        togglePortal,
        toggleFeature,
    };
}
