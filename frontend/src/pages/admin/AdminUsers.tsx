import { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import { useToast } from "../../hooks/useToast";
import type { User } from "../../types";
import { FiSearch, FiChevronLeft, FiChevronRight, FiShield } from "react-icons/fi";

export default function AdminUsers() {
    const { showToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getUsers(page, 15, search, statusFilter);
            setUsers(data.users);
            setTotalPages(data.pagination.totalPages);
        } catch {
            showToast("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter, showToast]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleRoleToggle = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!confirm(`Change role to ${newRole}?`)) return;
        try {
            await adminService.updateUserRole(userId, newRole as "user" | "admin");
            showToast(`Role updated to ${newRole}`, "success");
            fetchUsers();
        } catch {
            showToast("Failed to update role", "error");
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 rounded-lg border border-border bg-bg-surface text-text-primary text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : users.length === 0 ? (
                    <p className="text-center py-12 text-text-tertiary text-sm">No users found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border bg-bg-muted/50">
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Name</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Email</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Role</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Status</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Portals</th>
                                    <th className="text-left py-3 px-4 text-text-tertiary font-medium">Joined</th>
                                    <th className="text-right py-3 px-4 text-text-tertiary font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-b border-border/50 last:border-0 hover:bg-bg-muted/30 transition-colors">
                                        <td className="py-3 px-4 font-medium text-text-primary">{u.name}</td>
                                        <td className="py-3 px-4 text-text-secondary">{u.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-[#7C5CFC]/15 text-[#7C5CFC]" : "bg-bg-muted text-text-tertiary"
                                                }`}>
                                                {u.role === "admin" && <FiShield size={10} />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.subscriptionStatus === "active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                                                }`}>
                                                {u.subscriptionStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-text-tertiary text-xs">
                                            {u.purchasedPortals?.join(", ") || "—"}
                                        </td>
                                        <td className="py-3 px-4 text-text-tertiary">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleRoleToggle(u._id, u.role)}
                                                className="text-xs text-primary hover:text-primary-hover font-medium cursor-pointer"
                                            >
                                                {u.role === "admin" ? "Demote" : "Promote"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
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
