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
            <div className="bg-bg-surface border border-border rounded-xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-bg-muted flex items-center justify-center mx-auto mb-4">
                    <FiShoppingCart size={24} className="text-text-tertiary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                    Your Selection
                </h3>
                <p className="text-sm text-text-tertiary">
                    Select at least one portal to see pricing
                </p>
            </div>
        );
    }

    const isAnnual = billingCycle === "annual";
    const period = isAnnual ? "/yr" : "/mo";

    return (
        <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-text-primary mb-5">
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
                <span className="text-text-primary">₹{breakdown.subtotal.toLocaleString()}</span>
            </div>

            {/* Discount */}
            {breakdown.discountPercentage > 0 && (
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-success flex items-center gap-1">
                        <FiTag size={13} />
                        Bundle discount ({breakdown.discountPercentage}%)
                    </span>
                    <span className="text-success font-medium">
                        −₹{breakdown.discountAmount.toLocaleString()}
                    </span>
                </div>
            )}

            {/* Annual savings note */}
            {isAnnual && (
                <div className="text-xs text-success bg-success-light px-3 py-1.5 rounded-md mb-3">
                    🎉 You save 2 months with annual billing!
                </div>
            )}

            {/* Divider */}
            <div className="h-px bg-border mb-4" />

            {/* Total */}
            <div className="flex justify-between items-baseline mb-6">
                <span className="text-text-primary font-semibold">Total</span>
                <div className="text-right">
                    <span className="text-2xl font-bold text-text-primary">
                        ₹{breakdown.total.toLocaleString()}
                    </span>
                    <span className="text-sm text-text-tertiary">{period}</span>
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
