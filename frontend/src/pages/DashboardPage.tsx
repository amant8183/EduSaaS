import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fi";

// Portal display metadata
const portalMeta: Record<string, { label: string; icon: string; color: string }> = {
    admin: { label: "School Admin", icon: "🏫", color: "bg-[#7C5CFC]/10 text-[#7C5CFC]" },
    teacher: { label: "Teacher", icon: "👩‍🏫", color: "bg-[#2DBDB6]/10 text-[#2DBDB6]" },
    student: { label: "Student", icon: "🎓", color: "bg-[#F59E0B]/10 text-[#F59E0B]" },
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [subDetail, setSubDetail] = useState<SubscriptionDetail | null>(null);
    const [payments, setPayments] = useState<PaymentHistoryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState("");
    const [paymentPage, setPaymentPage] = useState(1);

    // Fetch all data
    const fetchData = useCallback(async () => {
        try {
            const [dash, sub, pay] = await Promise.all([
                userService.getDashboard(),
                userService.getSubscription(),
                userService.getPaymentHistory(paymentPage),
            ]);
            setSummary(dash);
            setSubDetail(sub);
            setPayments(pay);
        } catch {
            showToast("Failed to load dashboard data", "error");
        } finally {
            setLoading(false);
        }
    }, [paymentPage, showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Toggle auto-renew
    const handleToggleAutoRenew = async () => {
        setActionLoading("autoRenew");
        try {
            const res = await userService.toggleAutoRenew();
            showToast(res.message, "success");
            await fetchData();
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
            await fetchData();
        } catch {
            showToast("Failed to cancel subscription", "error");
        } finally {
            setActionLoading("");
        }
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex items-center gap-3 text-text-secondary">
                    <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Loading dashboard...
                </div>
            </div>
        );
    }

    const sub = subDetail?.subscription;
    const hasSub = subDetail?.hasSubscription && sub;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">
                    Welcome back, {summary?.user.name || user?.name || "User"}
                </h1>
                <p className="text-text-secondary mt-1">
                    Manage your subscription, portals, and payments
                </p>
            </div>

            {/* Subscription Status Card */}
            <div className="bg-bg-surface border border-border rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FiPackage size={20} className="text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary">Subscription</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                {hasSub ? (
                                    <>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-success/15 text-success">
                                            <FiCheckCircle size={12} /> Active
                                        </span>
                                        <span className="text-xs text-text-tertiary">
                                            {sub.billingCycle === "annual" ? "Annual" : "Monthly"} plan
                                        </span>
                                    </>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/15 text-warning">
                                        <FiAlertCircle size={12} /> No active subscription
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {!hasSub && (
                        <button
                            onClick={() => navigate("/pricing")}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors cursor-pointer"
                        >
                            Get Started <FiArrowRight size={14} />
                        </button>
                    )}
                </div>

                {hasSub && (
                    <>
                        {/* Dates & days remaining */}
                        <div className="grid sm:grid-cols-3 gap-4 mb-5">
                            <div className="flex items-center gap-3 bg-bg-muted/50 rounded-lg px-4 py-3">
                                <FiCalendar size={16} className="text-text-tertiary" />
                                <div>
                                    <p className="text-xs text-text-tertiary">Start Date</p>
                                    <p className="text-sm font-medium text-text-primary">
                                        {new Date(sub.startDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-bg-muted/50 rounded-lg px-4 py-3">
                                <FiCalendar size={16} className="text-text-tertiary" />
                                <div>
                                    <p className="text-xs text-text-tertiary">End Date</p>
                                    <p className="text-sm font-medium text-text-primary">
                                        {new Date(sub.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-bg-muted/50 rounded-lg px-4 py-3">
                                <FiClock size={16} className="text-text-tertiary" />
                                <div>
                                    <p className="text-xs text-text-tertiary">Days Remaining</p>
                                    <p className="text-sm font-medium text-text-primary">
                                        {sub.daysRemaining} days
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Subscription actions */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleToggleAutoRenew}
                                disabled={actionLoading === "autoRenew"}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-bg-muted transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {sub.autoRenew ? <FiToggleRight size={16} className="text-success" /> : <FiToggleLeft size={16} />}
                                Auto-renew: {sub.autoRenew ? "On" : "Off"}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={actionLoading === "cancel"}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-error/30 text-sm font-medium text-error hover:bg-error/5 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <FiXCircle size={16} />
                                Cancel Subscription
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Active Portals */}
            {hasSub && sub.portals.length > 0 && (
                <div className="bg-bg-surface border border-border rounded-xl p-6 mb-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Active Portals</h2>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {sub.portals.map((portalId) => {
                            const meta = portalMeta[portalId] || {
                                label: portalId,
                                icon: "📦",
                                color: "bg-bg-muted text-text-secondary",
                            };
                            return (
                                <div
                                    key={portalId}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-3 ${meta.color}`}
                                >
                                    <span className="text-xl">{meta.icon}</span>
                                    <div>
                                        <p className="text-sm font-semibold">{meta.label}</p>
                                        <p className="text-xs opacity-70">Portal Access</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Active features */}
                    {sub.features.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-text-tertiary mb-2">Add-on Features</p>
                            <div className="flex flex-wrap gap-2">
                                {sub.features.map((feat) => (
                                    <span
                                        key={feat}
                                        className="px-3 py-1 rounded-full bg-bg-muted text-xs font-medium text-text-secondary"
                                    >
                                        {feat.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Payment History */}
            <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FiCreditCard size={20} className="text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">Payment History</h2>
                    </div>
                </div>

                {(!payments || payments.payments.length === 0) ? (
                    <div className="text-center py-8">
                        <FiCreditCard size={32} className="mx-auto text-text-tertiary mb-3" />
                        <p className="text-text-secondary text-sm">No payments yet</p>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-2 text-text-tertiary font-medium">Date</th>
                                        <th className="text-left py-3 px-2 text-text-tertiary font-medium">Payment ID</th>
                                        <th className="text-left py-3 px-2 text-text-tertiary font-medium">Amount</th>
                                        <th className="text-left py-3 px-2 text-text-tertiary font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.payments.map((p) => (
                                        <tr key={p._id} className="border-b border-border/50 last:border-0">
                                            <td className="py-3 px-2 text-text-secondary">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-2 text-text-tertiary font-mono text-xs">
                                                {p.paymentId.slice(0, 20)}...
                                            </td>
                                            <td className="py-3 px-2 text-text-primary font-medium">
                                                ₹{p.amount.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-2">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "success"
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
                                        className="p-2 rounded-lg border border-border text-text-secondary hover:bg-bg-muted transition-colors disabled:opacity-30 cursor-pointer"
                                    >
                                        <FiChevronLeft size={14} />
                                    </button>
                                    <button
                                        onClick={() => setPaymentPage((p) => p + 1)}
                                        disabled={!payments.pagination.hasMore}
                                        className="p-2 rounded-lg border border-border text-text-secondary hover:bg-bg-muted transition-colors disabled:opacity-30 cursor-pointer"
                                    >
                                        <FiChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
