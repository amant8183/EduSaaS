import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService, type AdminSubscription } from "../../services/adminService";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Loading from "../../components/common/Loading";

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
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 rounded-xl border border-border bg-bg-surface text-text-primary text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="py-16">
                        <Loading />
                    </div>
                ) : subs.length === 0 ? (
                    <p className="text-center py-12 text-text-tertiary text-sm">No subscriptions found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-bg-muted/50">
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">User</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Portals</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Billing</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Amount</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Period</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subs.map((s) => (
                                    <tr key={s._id} className="border-b border-border/50 last:border-0 hover:bg-bg-muted/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-text-primary">
                                                {typeof s.userId === "object" ? s.userId.name : "—"}
                                            </p>
                                            <p className="text-xs text-text-tertiary">
                                                {typeof s.userId === "object" ? s.userId.email : s.userId}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {s.portals.map((p) => (
                                                    <span key={p} className="px-2 py-0.5 rounded-full bg-bg-muted text-xs text-text-secondary capitalize">{p}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-text-secondary capitalize">{s.billingCycle}</td>
                                        <td className="py-3 px-4 text-text-primary font-medium">₹{s.amount.toLocaleString()}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.status === "active" ? "bg-success/15 text-success"
                                                : s.status === "cancelled" ? "bg-error/15 text-error"
                                                    : "bg-warning/15 text-warning"
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text-tertiary text-xs">
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
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-30 cursor-pointer"><FiChevronLeft size={14} /></button>
                            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} className="p-2 rounded-xl border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-30 cursor-pointer"><FiChevronRight size={14} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
