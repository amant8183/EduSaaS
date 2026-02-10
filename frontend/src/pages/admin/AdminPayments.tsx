import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "../../services/adminService";
import type { Payment } from "../../types";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Loading from "../../components/common/Loading";

export default function AdminPayments() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");

    const { data: result, isLoading: loading } = useQuery({
        queryKey: ["admin-payments", page, statusFilter],
        queryFn: () => adminService.getPayments(page, 15, statusFilter),
    });

    const payments: Payment[] = result?.payments ?? [];
    const totalPages = result?.pagination?.totalPages ?? 1;

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 rounded-md border border-border bg-bg-surface text-text-primary text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="py-16">
                        <Loading />
                    </div>
                ) : payments.length === 0 ? (
                    <p className="text-center py-12 text-text-tertiary text-sm">No payments found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-bg-muted/50">
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">User</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Payment ID</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Amount</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p._id} className="border-b border-border/50 last:border-0 hover:bg-bg-muted/30 transition-colors">
                                        <td className="py-3 px-4">
                                            {typeof p.userId === "object" ? (
                                                <div>
                                                    <p className="font-medium text-text-primary">{p.userId.name}</p>
                                                    <p className="text-xs text-text-tertiary">{p.userId.email}</p>
                                                </div>
                                            ) : (
                                                <span className="text-text-tertiary">—</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-text-tertiary font-mono text-xs">
                                            {p.paymentId.slice(0, 20)}...
                                        </td>
                                        <td className="py-3 px-4 text-text-primary font-medium">
                                            ₹{p.amount.toLocaleString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "success" ? "bg-success/15 text-success"
                                                : p.status === "failed" ? "bg-error/15 text-error"
                                                    : "bg-warning/15 text-warning"
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text-tertiary">
                                            {new Date(p.createdAt).toLocaleDateString()}
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
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-md border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-30 cursor-pointer"><FiChevronLeft size={14} /></button>
                            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} className="p-2 rounded-md border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-30 cursor-pointer"><FiChevronRight size={14} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
