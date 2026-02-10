import { useQuery } from "@tanstack/react-query";
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
        { label: "Total Users", value: m.totalUsers, icon: FiUsers, color: "text-[#7C5CFC]", bg: "bg-[#7C5CFC]/10" },
        { label: "Active Subs", value: m.activeSubscriptions, icon: FiPackage, color: "text-[#2DBDB6]", bg: "bg-[#2DBDB6]/10" },
        { label: "Total Revenue", value: `₹${m.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: "text-success", bg: "bg-success/10" },
        { label: "Portal Types", value: Object.keys(m.portalDistribution).length, icon: FiTrendingUp, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    ];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className="bg-bg-surface border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-text-tertiary">{kpi.label}</span>
                            <div className={`w-9 h-9 rounded-md ${kpi.bg} flex items-center justify-center`}>
                                <kpi.icon size={18} className={kpi.color} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-text-primary">{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Portal Distribution */}
                <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Portal Distribution</h3>
                    <div className="space-y-3">
                        {Object.entries(m.portalDistribution).map(([portal, count]) => {
                            const total = Object.values(m.portalDistribution).reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                            return (
                                <div key={portal}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-text-secondary">{portalLabels[portal] || portal}</span>
                                        <span className="text-text-primary font-medium">{count} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 bg-bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {Object.keys(m.portalDistribution).length === 0 && (
                            <p className="text-sm text-text-tertiary">No data yet</p>
                        )}
                    </div>
                </div>

                {/* Recent Payments */}
                <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Payments</h3>
                    {data.recentPayments.length === 0 ? (
                        <p className="text-sm text-text-tertiary text-center py-6">No payments yet</p>
                    ) : (
                        <div className="space-y-3">
                            {data.recentPayments.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center justify-between text-sm">
                                    <div>
                                        <p className="text-text-primary font-medium">
                                            {typeof p.user === "object" ? p.user.name : "Unknown"}
                                        </p>
                                        <p className="text-xs text-text-tertiary">
                                            {new Date(p.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="font-semibold text-text-primary">
                                        ₹{p.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Subscription Status Breakdown */}
            {Object.keys(m.subscriptionsByStatus).length > 0 && (
                <div className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Subscription Status</h3>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(m.subscriptionsByStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center gap-2 px-4 py-2 rounded-md bg-bg-muted">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full ${status === "active" ? "bg-success" : status === "cancelled" ? "bg-error" : "bg-warning"
                                        }`}
                                />
                                <span className="text-sm text-text-secondary capitalize">{status}</span>
                                <span className="text-sm font-bold text-text-primary">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
