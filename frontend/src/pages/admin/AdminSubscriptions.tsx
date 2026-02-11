import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { adminService, type AdminSubscription } from "../../services/adminService";
import { FiChevronLeft, FiChevronRight, FiPackage } from "react-icons/fi";
import Loading from "../../components/common/Loading";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export default function AdminSubscriptions() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");

    const { data: result, isLoading: loading } = useQuery({
        queryKey: ["admin-subscriptions", page, statusFilter],
        queryFn: () => adminService.getSubscriptions(page, 15, statusFilter),
    });

    const subs: AdminSubscription[] = result?.subscriptions ?? [];
    const totalPages = result?.pagination?.totalPages ?? 1;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-4"
        >
            {/* Filter */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-border bg-bg-elevated text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer bg-position-[right_0.75rem_center] bg-no-repeat bg-size-[16px_16px] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="relative bg-bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-accent to-primary" />

                {loading ? (
                    <div className="py-16">
                        <Loading />
                    </div>
                ) : subs.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center mx-auto mb-4">
                            <FiPackage size={24} className="text-text-tertiary" />
                        </div>
                        <p className="text-text-tertiary text-sm font-medium">No subscriptions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">User</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Portals</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Billing</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Amount</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Period</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subs.map((s) => (
                                    <tr key={s._id} className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/40 transition-colors">
                                        <td className="py-3.5 px-4">
                                            <p className="font-semibold text-text-primary">
                                                {s.userId && typeof s.userId === "object" ? s.userId.name : "—"}
                                            </p>
                                            <p className="text-xs text-text-tertiary">
                                                {s.userId && typeof s.userId === "object" ? s.userId.email : s.userId ?? "—"}
                                            </p>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {s.portals.map((p) => (
                                                    <span key={p} className="px-2.5 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-xs text-text-secondary capitalize font-medium">{p}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-text-secondary capitalize">{s.billingCycle}</td>
                                        <td className="py-3.5 px-4 text-text-primary font-semibold">₹{s.amount.toLocaleString()}</td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.status === "active" ? "bg-success/15 text-success"
                                                : s.status === "cancelled" ? "bg-error/15 text-error"
                                                    : "bg-warning/15 text-warning"
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-text-tertiary text-xs">
                                            {new Date(s.startDate).toLocaleDateString()} — {new Date(s.endDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                        <p className="text-xs text-text-tertiary">Page {page} of {totalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-border text-text-secondary hover:bg-bg-elevated transition-colors disabled:opacity-30 cursor-pointer"><FiChevronLeft size={14} /></button>
                            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} className="p-2 rounded-xl border border-border text-text-secondary hover:bg-bg-elevated transition-colors disabled:opacity-30 cursor-pointer"><FiChevronRight size={14} /></button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
