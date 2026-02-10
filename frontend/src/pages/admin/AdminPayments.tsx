import { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../hooks/useToast";
import type { Payment } from "../../types";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function AdminPayments() {
    const { showToast } = useToast();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getPayments(page, 15, statusFilter);
            setPayments(data.payments);
            setTotalPages(data.pagination.totalPages);
        } catch {
            showToast("Failed to load payments", "error");
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, showToast]);

    useEffect(() => { fetch(); }, [fetch]);

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 rounded-lg border border-border bg-bg-surface text-text-primary text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-30 cursor-pointer"><FiChevronLeft size={14} /></button>
                            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} className="p-2 rounded-lg border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-30 cursor-pointer"><FiChevronRight size={14} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
