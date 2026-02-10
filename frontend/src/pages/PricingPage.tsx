import { useNavigate } from "react-router-dom";
import { usePricing } from "../hooks/usePricing";
import { useAuth } from "../hooks/useAuth";
import { useRazorpay } from "../hooks/useRazorpay";
import PortalCard from "../components/pricing/PortalCard";
import FeatureToggle from "../components/pricing/FeatureToggle";
import PricingSummary from "../components/pricing/PricingSummary";
import Loading from "../components/common/Loading";

export default function PricingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { checkout, loading: paymentLoading } = useRazorpay();
    const {
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
    } = usePricing();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate("/register");
            return;
        }

        if (selectedPortals.length === 0) return;

        const success = await checkout({
            portals: selectedPortals,
            features: selectedFeatures,
            billingCycle,
        });

        if (success) {
            navigate("/dashboard");
        }
    };

    // ===== Loading skeleton =====
    if (loading) {
        return <Loading />;
    }

    if (error || !data) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary mb-2">{error || "Something went wrong"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-primary font-medium hover:text-primary-hover transition-colors cursor-pointer"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    // Portals that have features and are currently selected
    const selectedPortalData = data.portals.filter((p) =>
        selectedPortals.includes(p.id)
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            {/* ===== Hero ===== */}
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
                    Simple, transparent pricing
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
                    Choose the portals your school needs. Bundle multiple portals for bigger savings.
                </p>

                {/* Billing toggle */}
                <div className="inline-flex items-center gap-3 bg-bg-elevated rounded-full p-1.5">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${billingCycle === "monthly"
                            ? "bg-primary text-text-inverse shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("annual")}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${billingCycle === "annual"
                            ? "bg-primary text-text-inverse shadow-sm"
                            : "text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        Annual
                        <span className="ml-1.5 text-xs bg-success/15 text-success px-2 py-0.5 rounded-full">
                            Save 2 months
                        </span>
                    </button>
                </div>
            </div>

            {/* ===== Main layout: Grid + Sidebar ===== */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left: Portal cards + Features */}
                <div className="flex-1 min-w-0">
                    {/* Portal cards grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {data.portals.map((portal) => (
                            <PortalCard
                                key={portal.id}
                                portal={portal}
                                selected={selectedPortals.includes(portal.id)}
                                onToggle={() => togglePortal(portal.id)}
                            />
                        ))}
                    </div>

                    {/* Feature add-ons (only for selected portals) */}
                    {selectedPortalData.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-text-primary">
                                Add-on Features
                            </h2>

                            {selectedPortalData.map((portal) => (
                                <div key={portal.id}>
                                    <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                                        {portal.name}
                                    </h3>
                                    <div className="space-y-2">
                                        {portal.availableFeatures.map((feat) => (
                                            <FeatureToggle
                                                key={feat.id}
                                                feature={feat}
                                                selected={selectedFeatures.includes(feat.id)}
                                                onToggle={() => toggleFeature(feat.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bundle discount info */}
                    {data.discounts.length > 0 && (
                        <div className="mt-10 bg-bg-elevated rounded-xl p-6 border border-border">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                💡 Bundle Discounts
                            </h3>
                            <div className="grid sm:grid-cols-3 gap-3">
                                {data.discounts.map((d) => (
                                    <div
                                        key={d.id}
                                        className="bg-bg-surface rounded-lg p-4 border border-border"
                                    >
                                        <span className="inline-block bg-success/15 text-success text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                                            {d.discount}% OFF
                                        </span>
                                        <p className="text-sm font-medium text-text-primary">
                                            {d.name}
                                        </p>
                                        <p className="text-xs text-text-tertiary mt-1">
                                            {d.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Sticky summary sidebar */}
                <div className="lg:w-80 shrink-0">
                    <div className="lg:sticky lg:top-24">
                        <PricingSummary
                            breakdown={priceBreakdown}
                            billingCycle={billingCycle}
                            calculating={calculating || paymentLoading}
                            onCheckout={handleCheckout}
                            isAuthenticated={isAuthenticated}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
