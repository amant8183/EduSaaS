import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import {
    userService,
    type DashboardSummary,
    type SubscriptionDetail,
    type PaymentHistoryResponse,
} from "../services/userService";
import {
    FiPackage,
    FiCreditCard,
    FiCalendar,
    FiClock,
    FiToggleLeft,
    FiToggleRight,
    FiXCircle,
    FiArrowRight,
    FiCheckCircle,
    FiAlertCircle,
    FiChevronLeft,
    FiChevronRight,
    FiZap,
} from "react-icons/fi";
import Loading from "../components/common/Loading";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

// Portal display metadata
const portalMeta: Record<string, { label: string; icon: string; color: string; glow: string; borderAccent: string }> = {
    admin: {
        label: "School Admin",
        icon: "🏫",
        color: "bg-[#7C5CFC]/10 text-[#7C5CFC]",
        glow: "shadow-[0_4px_20px_rgba(124,92,252,0.10)]",
        borderAccent: "border-[#7C5CFC]/20",
    },
    teacher: {
        label: "Teacher",
        icon: "👩‍🏫",
        color: "bg-[#2DBDB6]/10 text-[#2DBDB6]",
        glow: "shadow-[0_4px_20px_rgba(45,189,182,0.10)]",
        borderAccent: "border-[#2DBDB6]/20",
    },
    student: {
        label: "Student",
        icon: "🎓",
        color: "bg-[#F59E0B]/10 text-[#F59E0B]",
        glow: "shadow-[0_4px_20px_rgba(245,158,11,0.10)]",
        borderAccent: "border-[#F59E0B]/20",
    },
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const [actionLoading, setActionLoading] = useState("");
    const [paymentPage, setPaymentPage] = useState(1);

    const { data: summary } = useQuery<DashboardSummary>({
        queryKey: ["user-dashboard"],
        queryFn: () => userService.getDashboard(),
    });

    const { data: subDetail } = useQuery<SubscriptionDetail>({
        queryKey: ["user-subscription"],
        queryFn: () => userService.getSubscription(),
    });

    const { data: payments } = useQuery<PaymentHistoryResponse>({
        queryKey: ["user-payments", paymentPage],
        queryFn: () => userService.getPaymentHistory(paymentPage),
    });

    const loading = !summary && !subDetail;

    // Toggle auto-renew
    const handleToggleAutoRenew = async () => {
        setActionLoading("autoRenew");
        try {
            const res = await userService.toggleAutoRenew();
            showToast(res.message, "success");
            queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
            queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
        } catch {
            showToast("Failed to update auto-renew", "error");
        } finally {
            setActionLoading("");
        }
    };

    // Cancel subscription
    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel your subscription?")) return;
        setActionLoading("cancel");
        try {
            const res = await userService.cancelSubscription();
            showToast(res.message, "success");
            queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
            queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
        } catch {
            showToast("Failed to cancel subscription", "error");
        } finally {
            setActionLoading("");
        }
    };

    // Loading skeleton
    if (loading) {
        return <Loading />;
    }

    const sub = subDetail?.subscription;
    const hasSub = subDetail?.hasSubscription && sub;

    return (
        <div className="min-h-screen overflow-hidden">

            {/* ════════════ HERO ════════════ */}
            <section className="relative px-4 pt-24 pb-12 md:pt-28 md:pb-16">
                {/* Background glow */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
                    <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/6 blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="max-w-6xl mx-auto"
                >
                    <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                        Dashboard
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.1]">
                        Welcome back,{" "}
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            {summary?.user.name || user?.name || "User"}
                        </span>
                    </h1>
                    <p className="text-lg text-text-secondary mt-3 max-w-xl">
                        Manage your subscription, portals, and payments
                    </p>
                </motion.div>
            </section>

            {/* ════════════ MAIN CONTENT ════════════ */}
            <section className="px-4 pb-20 md:pb-28">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* ── Subscription Status Card ── */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-40px" }}
                        variants={fadeUp}
                        custom={0}
                        className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
                    >
                        {/* Top accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 mt-1">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FiPackage size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-text-primary">Subscription</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        {hasSub ? (
                                            <>
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success">
                                                    <FiCheckCircle size={12} /> Active
                                                </span>
                                                <span className="text-xs text-text-tertiary">
                                                    {sub.billingCycle === "annual" ? "Annual" : "Monthly"} plan
                                                </span>
                                            </>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning/15 text-warning">
                                                <FiAlertCircle size={12} /> No active subscription
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!hasSub && (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate("/pricing")}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors cursor-pointer shadow-md"
                                >
                                    <FiZap size={14} />
                                    Get Started <FiArrowRight size={14} />
                                </motion.button>
                            )}
                        </div>

                        {hasSub && (
                            <>
                                {/* Dates & days remaining */}
                                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                                    {[
                                        { icon: FiCalendar, label: "Start Date", value: new Date(sub.startDate).toLocaleDateString() },
                                        { icon: FiCalendar, label: "End Date", value: new Date(sub.endDate).toLocaleDateString() },
                                        { icon: FiClock, label: "Days Remaining", value: `${sub.daysRemaining} days` },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-3 bg-bg-elevated/60 rounded-xl px-4 py-3 border border-border/50">
                                            <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
                                                <item.icon size={16} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-tertiary">{item.label}</p>
                                                <p className="text-sm font-semibold text-text-primary">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Subscription actions */}
                                <div className="flex flex-wrap gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleToggleAutoRenew}
                                        disabled={actionLoading === "autoRenew"}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-bg-elevated transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {sub.autoRenew ? <FiToggleRight size={16} className="text-success" /> : <FiToggleLeft size={16} />}
                                        Auto-renew: {sub.autoRenew ? "On" : "Off"}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleCancel}
                                        disabled={actionLoading === "cancel"}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-error/30 text-sm font-medium text-error hover:bg-error/5 transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        <FiXCircle size={16} />
                                        Cancel Subscription
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* ── Active Portals ── */}
                    {hasSub && sub.portals.length > 0 && (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-40px" }}
                            variants={fadeUp}
                            custom={1}
                            className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent to-primary" />

                            <h2 className="text-lg font-bold text-text-primary mb-4 mt-1">Active Portals</h2>
                            <div className="grid sm:grid-cols-3 gap-3">
                                {sub.portals.map((portalId) => {
                                    const meta = portalMeta[portalId] || {
                                        label: portalId,
                                        icon: "📦",
                                        color: "bg-bg-muted text-text-secondary",
                                        glow: "",
                                        borderAccent: "border-border",
                                    };
                                    return (
                                        <motion.div
                                            key={portalId}
                                            whileHover={{ y: -2 }}
                                            className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-all duration-300 ${meta.color} ${meta.glow} ${meta.borderAccent}`}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                                                <span className="text-xl">{meta.icon}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{meta.label}</p>
                                                <p className="text-xs opacity-70">Portal Access</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Active features */}
                            {sub.features.length > 0 && (
                                <div className="mt-5 pt-5 border-t border-border">
                                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                                        Add-on Features
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {sub.features.map((feat) => (
                                            <span
                                                key={feat}
                                                className="px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs font-medium text-text-secondary"
                                            >
                                                {feat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Payment History ── */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-40px" }}
                        variants={fadeUp}
                        custom={2}
                        className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-accent to-primary" />

                        <div className="flex items-center justify-between mb-5 mt-1">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FiCreditCard size={20} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-bold text-text-primary">Payment History</h2>
                            </div>
                        </div>

                        {(!payments || payments.payments.length === 0) ? (
                            <div className="text-center py-10">
                                <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center mx-auto mb-4">
                                    <FiCreditCard size={24} className="text-text-tertiary" />
                                </div>
                                <p className="text-text-secondary text-sm font-medium">No payments yet</p>
                                <p className="text-text-tertiary text-xs mt-1">Your payment history will appear here</p>
                            </div>
                        ) : (
                            <>
                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left py-3 px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Date</th>
                                                <th className="text-left py-3 px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Payment ID</th>
                                                <th className="text-left py-3 px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Amount</th>
                                                <th className="text-left py-3 px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.payments.map((p) => (
                                                <tr key={p._id} className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/40 transition-colors">
                                                    <td className="py-3.5 px-3 text-text-secondary">
                                                        {new Date(p.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3.5 px-3 text-text-tertiary font-mono text-xs">
                                                        {p.paymentId.slice(0, 20)}...
                                                    </td>
                                                    <td className="py-3.5 px-3 text-text-primary font-semibold">
                                                        ₹{p.amount.toLocaleString()}
                                                    </td>
                                                    <td className="py-3.5 px-3">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.status === "success"
                                                                ? "bg-success/15 text-success"
                                                                : p.status === "failed"
                                                                    ? "bg-error/15 text-error"
                                                                    : "bg-warning/15 text-warning"
                                                                }`}
                                                        >
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {payments.pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                                        <p className="text-xs text-text-tertiary">
                                            Page {payments.pagination.currentPage} of {payments.pagination.totalPages}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setPaymentPage((p) => Math.max(1, p - 1))}
                                                disabled={paymentPage === 1}
                                                className="p-2 rounded-xl border border-border text-text-secondary hover:bg-bg-elevated transition-colors disabled:opacity-30 cursor-pointer"
                                            >
                                                <FiChevronLeft size={14} />
                                            </button>
                                            <button
                                                onClick={() => setPaymentPage((p) => p + 1)}
                                                disabled={!payments.pagination.hasMore}
                                                className="p-2 rounded-xl border border-border text-text-secondary hover:bg-bg-elevated transition-colors disabled:opacity-30 cursor-pointer"
                                            >
                                                <FiChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
