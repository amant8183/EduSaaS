import { useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { usePricing } from "../hooks/usePricing";
import { useAuth } from "../hooks/useAuth";
import { useRazorpay } from "../hooks/useRazorpay";
import PortalCard from "../components/pricing/PortalCard";
import FeatureToggle from "../components/pricing/FeatureToggle";
import PricingSummary from "../components/pricing/PricingSummary";
import Loading from "../components/common/Loading";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

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
        <div className="min-h-screen overflow-hidden">

            {/* ════════════ HERO ════════════ */}
            <section className="relative px-4 pt-24 pb-16 text-center md:pt-32 md:pb-20">
                {/* Background glow */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
                    <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/6 blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mx-auto max-w-4xl"
                >
                    {/* Kicker */}
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
                        Pricing
                    </p>

                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl md:text-6xl leading-[1.1]">
                        Simple,{" "}
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            transparent
                        </span>{" "}
                        pricing
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary leading-relaxed">
                        Choose the portals your school needs. Bundle multiple portals for bigger savings.
                    </p>

                    {/* Billing toggle */}
                    <div className="inline-flex items-center gap-1 bg-bg-elevated rounded-full p-1.5 border border-border">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${billingCycle === "monthly"
                                ? "bg-primary text-text-inverse shadow-md"
                                : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle("annual")}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${billingCycle === "annual"
                                ? "bg-primary text-text-inverse shadow-md"
                                : "text-text-secondary hover:text-text-primary"
                                }`}
                        >
                            Annual
                            <span className="ml-1.5 text-xs bg-success/15 text-success px-2 py-0.5 rounded-full font-semibold">
                                Save 2 months
                            </span>
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ════════════ MAIN CONTENT ════════════ */}
            <section className="px-4 pb-20 md:pb-28">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                    {/* Left: Portal cards + Features */}
                    <div className="flex-1 min-w-0">

                        {/* ── Portal Cards ── */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
                        >
                            {data.portals.map((portal, i) => (
                                <motion.div key={portal.id} custom={i} variants={fadeUp}>
                                    <PortalCard
                                        portal={portal}
                                        selected={selectedPortals.includes(portal.id)}
                                        onToggle={() => togglePortal(portal.id)}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Feature Add-ons ── */}
                        {selectedPortalData.length > 0 && (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-40px" }}
                                className="space-y-6"
                            >
                                <motion.div variants={fadeUp} custom={0}>
                                    <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-1">
                                        Customize
                                    </p>
                                    <h2 className="text-2xl font-bold text-text-primary">
                                        Add-on Features
                                    </h2>
                                </motion.div>

                                {selectedPortalData.map((portal, i) => (
                                    <motion.div key={portal.id} custom={i + 1} variants={fadeUp}>
                                        <h3 className="text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                                            {portal.name}
                                        </h3>
                                        <div className="space-y-2.5">
                                            {portal.availableFeatures.map((feat) => (
                                                <FeatureToggle
                                                    key={feat.id}
                                                    feature={feat}
                                                    selected={selectedFeatures.includes(feat.id)}
                                                    onToggle={() => toggleFeature(feat.id)}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* ── Bundle Discounts ── */}
                        {data.discounts.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="mt-10 bg-bg-surface rounded-2xl p-6 border border-border shadow-sm"
                            >
                                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-base">💡</span>
                                    Bundle Discounts
                                </h3>
                                <div className="grid sm:grid-cols-3 gap-3">
                                    {data.discounts.map((d) => (
                                        <div
                                            key={d.id}
                                            className="bg-bg-elevated/60 rounded-xl p-4 border border-border hover:border-success/30 transition-colors duration-200"
                                        >
                                            <span className="inline-block bg-success/15 text-success text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
                                                {d.discount}% OFF
                                            </span>
                                            <p className="text-sm font-semibold text-text-primary">
                                                {d.name}
                                            </p>
                                            <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                                                {d.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right: Sticky summary sidebar */}
                    <div className="lg:w-[340px] shrink-0">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="lg:sticky lg:top-24"
                        >
                            <PricingSummary
                                breakdown={priceBreakdown}
                                billingCycle={billingCycle}
                                calculating={calculating || paymentLoading}
                                onCheckout={handleCheckout}
                                isAuthenticated={isAuthenticated}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
