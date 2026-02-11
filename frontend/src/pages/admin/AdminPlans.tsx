import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { FiSave, FiDollarSign, FiPercent, FiBox } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Loading from "../../components/common/Loading";
import { useToast } from "../../hooks/useToast";
import {
    adminService,
    type AdminPricingConfig,
    type AdminFeaturePrice,
    type AdminBundleDiscount,
} from "../../services/adminService";

const portalLabels: Record<string, string> = {
    admin: "🏫 School Admin",
    teacher: "👩‍🏫 Teacher",
    student: "🎓 Student",
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export default function AdminPlans() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [saving, setSaving] = useState(false);

    // Editable state
    const [portalPrices, setPortalPrices] = useState<Record<string, number>>({});
    const [featurePrices, setFeaturePrices] = useState<AdminFeaturePrice[]>([]);
    const [bundleDiscounts, setBundleDiscounts] = useState<AdminBundleDiscount[]>([]);

    // Track if anything changed
    const [dirty, setDirty] = useState(false);

    const { data: pricingData, isLoading: loading } = useQuery<AdminPricingConfig>({
        queryKey: ["admin-pricing"],
        queryFn: () => adminService.getPricing(),
    });

    // Seed editable state when data arrives
    useEffect(() => {
        if (pricingData) {
            setPortalPrices(pricingData.portalPrices);
            setFeaturePrices(pricingData.featurePrices);
            setBundleDiscounts(pricingData.bundleDiscounts);
        }
    }, [pricingData]);

    const handlePortalPriceChange = (portal: string, value: number) => {
        setPortalPrices((prev) => ({ ...prev, [portal]: value }));
        setDirty(true);
    };

    const handleFeaturePriceChange = (featureId: string, value: number) => {
        setFeaturePrices((prev) =>
            prev.map((f) => (f.id === featureId ? { ...f, price: value } : f))
        );
        setDirty(true);
    };

    const handleDiscountChange = (discountId: string, value: number) => {
        setBundleDiscounts((prev) =>
            prev.map((d) => (d.id === discountId ? { ...d, discount: value } : d))
        );
        setDirty(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Build payload
            const featurePriceMap: Record<string, number> = {};
            featurePrices.forEach((f) => {
                featurePriceMap[f.id] = f.price;
            });

            const discountMap: Record<string, number> = {};
            bundleDiscounts.forEach((d) => {
                discountMap[d.id] = d.discount;
            });

            await adminService.updatePricing({
                portalPrices,
                featurePrices: featurePriceMap,
                bundleDiscounts: discountMap,
            });

            showToast("Pricing updated successfully!", "success");
            setDirty(false);
            queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
        } catch {
            showToast("Failed to update pricing", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading />;

    // Group features by portal
    const featuresByPortal: Record<string, AdminFeaturePrice[]> = {};
    featurePrices.forEach((f) => {
        if (!featuresByPortal[f.portal]) featuresByPortal[f.portal] = [];
        featuresByPortal[f.portal].push(f);
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-extrabold text-text-primary">
                        Plans &{" "}
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            Pricing
                        </span>
                    </h1>
                    <p className="text-sm text-text-tertiary mt-1">
                        Manage portal prices, feature add-ons, and bundle discounts
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    loading={saving}
                    disabled={!dirty}
                    icon={<FiSave size={16} />}
                >
                    Save Changes
                </Button>
            </motion.div>

            {/* ── Portal Base Prices ── */}
            <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />

                <div className="flex items-center gap-2.5 mb-5 mt-1">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FiDollarSign size={16} className="text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">
                        Portal Base Prices
                    </h2>
                    <span className="text-xs text-text-tertiary ml-1">
                        (₹ per month)
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Object.entries(portalPrices).map(([portal, price]) => (
                        <div
                            key={portal}
                            className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
                        >
                            <label className="block text-sm font-semibold text-text-secondary mb-2">
                                {portalLabels[portal] || portal}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                                    ₹
                                </span>
                                <input
                                    type="number"
                                    min={0}
                                    value={price}
                                    onChange={(e) =>
                                        handlePortalPriceChange(
                                            portal,
                                            Math.max(0, Number(e.target.value))
                                        )
                                    }
                                    className="w-full h-10 pl-8 pr-4 bg-bg-surface border border-border rounded-xl text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Feature Add-on Prices ── */}
            <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent to-primary" />

                <div className="flex items-center gap-2.5 mb-5 mt-1">
                    <div className="w-9 h-9 rounded-xl bg-[#2DBDB6]/10 flex items-center justify-center">
                        <FiBox size={16} className="text-[#2DBDB6]" />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">
                        Feature Add-on Prices
                    </h2>
                    <span className="text-xs text-text-tertiary ml-1">
                        (₹ per month)
                    </span>
                </div>

                <div className="space-y-6">
                    {Object.entries(featuresByPortal).map(([portal, features]) => (
                        <div key={portal}>
                            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-widest mb-3">
                                {portalLabels[portal] || portal} Portal
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((feat) => (
                                    <div
                                        key={feat.id}
                                        className="flex items-center justify-between gap-4 border border-border rounded-xl px-4 py-3 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-text-primary truncate">
                                                {feat.name}
                                            </p>
                                            <p className="text-xs text-text-tertiary truncate">
                                                {feat.description}
                                            </p>
                                        </div>
                                        <div className="relative shrink-0 w-28">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                                                ₹
                                            </span>
                                            <input
                                                type="number"
                                                min={0}
                                                value={feat.price}
                                                onChange={(e) =>
                                                    handleFeaturePriceChange(
                                                        feat.id,
                                                        Math.max(0, Number(e.target.value))
                                                    )
                                                }
                                                className="w-full h-9 pl-8 pr-3 bg-bg-surface border border-border rounded-xl text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Bundle Discounts ── */}
            <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-warning to-accent" />

                <div className="flex items-center gap-2.5 mb-5 mt-1">
                    <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center">
                        <FiPercent size={16} className="text-warning" />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary">
                        Bundle Discounts
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {bundleDiscounts.map((disc) => (
                        <div
                            key={disc.id}
                            className="border border-border rounded-xl p-4 hover:border-warning/30 transition-colors"
                        >
                            <label className="block text-sm font-semibold text-text-secondary mb-2">
                                {disc.name}
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={disc.discount}
                                    onChange={(e) =>
                                        handleDiscountChange(
                                            disc.id,
                                            Math.min(100, Math.max(0, Number(e.target.value)))
                                        )
                                    }
                                    className="w-full h-10 pl-4 pr-8 bg-bg-surface border border-border rounded-xl text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-sm">
                                    %
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Sticky save bar when dirty */}
            {dirty && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-bg-surface/95 backdrop-blur border-t border-border px-6 py-3 flex items-center justify-between z-50"
                >
                    <p className="text-sm text-text-secondary font-medium">
                        You have unsaved changes
                    </p>
                    <Button
                        onClick={handleSave}
                        loading={saving}
                        icon={<FiSave size={16} />}
                        size="sm"
                    >
                        Save Changes
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
