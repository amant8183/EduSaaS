import { useQuery } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import {
    adminService,
    type AdminDashboardResponse,
} from "../../services/adminService";
import {
    FiUsers,
    FiPackage,
    FiDollarSign,
    FiTrendingUp,
} from "react-icons/fi";
import Loading from "../../components/common/Loading";

const portalLabels: Record<string, string> = {
    admin: "Admin Portal",
    teacher: "Teacher Portal",
    student: "Student Portal",
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export default function AdminDashboard() {
    const { data, isLoading: loading } = useQuery<AdminDashboardResponse>({
        queryKey: ["admin-dashboard"],
        queryFn: () => adminService.getDashboard(),
    });

    if (loading) {
        return <Loading />;
    }

    if (!data) {
        return <p className="text-text-secondary text-center py-10">Failed to load metrics</p>;
    }

    const m = data.metrics;

    const kpis = [
        { label: "Total Users", value: m.totalUsers, icon: FiUsers, color: "text-[#7C5CFC]", bg: "bg-[#7C5CFC]/10", glow: "shadow-[0_4px_20px_rgba(124,92,252,0.08)]", borderAccent: "hover:border-[#7C5CFC]/30" },
        { label: "Active Subs", value: m.activeSubscriptions, icon: FiPackage, color: "text-[#2DBDB6]", bg: "bg-[#2DBDB6]/10", glow: "shadow-[0_4px_20px_rgba(45,189,182,0.08)]", borderAccent: "hover:border-[#2DBDB6]/30" },
        { label: "Total Revenue", value: `₹${m.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: "text-success", bg: "bg-success/10", glow: "shadow-[0_4px_20px_rgba(34,197,94,0.08)]", borderAccent: "hover:border-success/30" },
        { label: "Portal Types", value: Object.keys(m.portalDistribution).length, icon: FiTrendingUp, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10", glow: "shadow-[0_4px_20px_rgba(245,158,11,0.08)]", borderAccent: "hover:border-[#F59E0B]/30" },
    ];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className={`relative bg-bg-surface border border-border rounded-2xl p-5 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 ${kpi.glow} ${kpi.borderAccent}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-text-tertiary font-medium">{kpi.label}</span>
                            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                                <kpi.icon size={18} className={kpi.color} />
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-text-primary">{kpi.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Portal Distribution */}
                <motion.div
                    custom={4}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />
                    <h3 className="text-lg font-bold text-text-primary mb-5 mt-1">Portal Distribution</h3>
                    <div className="space-y-4">
                        {Object.entries(m.portalDistribution).map(([portal, count]) => {
                            const total = Object.values(m.portalDistribution).reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                                <div key={portal}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-text-secondary font-medium">{portalLabels[portal] || portal}</span>
                                        <span className="text-text-primary font-semibold">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2.5 bg-bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                                            className="h-full bg-linear-to-r from-primary to-accent rounded-full"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {Object.keys(m.portalDistribution).length === 0 && (
                            <p className="text-sm text-text-tertiary">No data yet</p>
                        )}
                    </div>
                </motion.div>

                {/* Recent Payments */}
                <motion.div
                    custom={5}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent to-primary" />
                    <h3 className="text-lg font-bold text-text-primary mb-5 mt-1">Recent Payments</h3>
                    {data.recentPayments.length === 0 ? (
                        <p className="text-sm text-text-tertiary text-center py-6">No payments yet</p>
                    ) : (
                        <div className="space-y-3">
                            {data.recentPayments.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
                                    <div>
                                        <p className="text-text-primary font-semibold">
                                            {typeof p.user === "object" ? p.user.name : "Unknown"}
                                        </p>
                                        <p className="text-xs text-text-tertiary">
                                            {new Date(p.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="font-bold text-text-primary">
                                        ₹{p.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Subscription Status Breakdown */}
            {Object.keys(m.subscriptionsByStatus).length > 0 && (
                <motion.div
                    custom={6}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="relative bg-bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-accent to-primary" />
                    <h3 className="text-lg font-bold text-text-primary mb-5 mt-1">Subscription Status</h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(m.subscriptionsByStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-bg-elevated border border-border/50">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${status === "active" ? "bg-success" : status === "cancelled" ? "bg-error" : "bg-warning"
                                        }`}
                                />
                                <span className="text-sm text-text-secondary capitalize font-medium">{status}</span>
                                <span className="text-sm font-bold text-text-primary">{count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
