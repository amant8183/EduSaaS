import type { PriceBreakdown } from "../../types";
import Button from "../ui/Button";
import { FiTag, FiShoppingCart } from "react-icons/fi";

interface Props {
    breakdown: PriceBreakdown | null;
    billingCycle: "monthly" | "annual";
    calculating: boolean;
    onCheckout: () => void;
    isAuthenticated: boolean;
}

export default function PricingSummary({
    breakdown,
    billingCycle,
    calculating,
    onCheckout,
    isAuthenticated,
}: Props) {
    if (!breakdown) {
        return (
            <div className="relative bg-bg-surface border border-border rounded-2xl p-6 text-center overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />
                <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center mx-auto mb-4 mt-2">
                    <FiShoppingCart size={24} className="text-text-tertiary" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-1.5">
                    Your Selection
                </h3>
                <p className="text-sm text-text-tertiary leading-relaxed">
                    Select at least one portal to see pricing
                </p>
            </div>
        );
    }

    const isAnnual = billingCycle === "annual";
    const period = isAnnual ? "/yr" : "/mo";

    return (
        <div className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />

            <h3 className="text-lg font-bold text-text-primary mb-5 mt-1">
                Order Summary
            </h3>

            {/* Line items */}
            <div className="space-y-3 mb-5">
                {/* Portals */}
                {breakdown.portals?.map((p) => (
                    <div key={p.id} className="flex justify-between text-sm">
                        <span className="text-text-secondary">{p.name}</span>
                        <span className="text-text-primary font-medium">
                            ₹{p.price.toLocaleString()}
                        </span>
                    </div>
                ))}

                {/* Features */}
                {breakdown.features?.map((f) => (
                    <div key={f.id} className="flex justify-between text-sm">
                        <span className="text-text-tertiary">+ {f.name}</span>
                        <span className="text-text-secondary">
                            ₹{f.price.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-border mb-4" />

            {/* Subtotal */}
            <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary font-medium">₹{breakdown.subtotal.toLocaleString()}</span>
            </div>

            {/* Discount */}
            {breakdown.discountPercentage > 0 && (
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-success flex items-center gap-1">
                        <FiTag size={13} />
                        Bundle discount ({breakdown.discountPercentage}%)
                    </span>
                    <span className="text-success font-semibold">
                        −₹{breakdown.discountAmount.toLocaleString()}
                    </span>
                </div>
            )}

            {/* Annual savings note */}
            {isAnnual && (
                <div className="text-xs text-success bg-success-light px-3 py-2 rounded-xl mb-3 font-medium">
                    🎉 You save 2 months with annual billing!
                </div>
            )}

            {/* Divider */}
            <div className="h-px bg-border mb-4" />

            {/* Total */}
            <div className="flex justify-between items-baseline mb-6">
                <span className="text-text-primary font-semibold">Total</span>
                <div className="text-right">
                    <span className="text-3xl font-extrabold text-text-primary">
                        ₹{breakdown.total.toLocaleString()}
                    </span>
                    <span className="text-sm text-text-tertiary ml-0.5">{period}</span>
                </div>
            </div>

            {/* CTA */}
            <Button
                fullWidth
                size="lg"
                loading={calculating}
                onClick={onCheckout}
                icon={<FiShoppingCart size={16} />}
            >
                {isAuthenticated ? "Subscribe Now" : "Sign Up to Subscribe"}
            </Button>

            <p className="text-xs text-text-tertiary text-center mt-3">
                Secure payment powered by Razorpay
            </p>
        </div>
    );
}
