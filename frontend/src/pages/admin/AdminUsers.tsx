import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { adminService } from "../../services/adminService";
import { useToast } from "../../hooks/useToast";
import type { User } from "../../types";
import { FiSearch, FiChevronLeft, FiChevronRight, FiShield, FiUsers } from "react-icons/fi";
import Loading from "../../components/common/Loading";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export default function AdminUsers() {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const { data: result, isLoading: loading } = useQuery({
        queryKey: ["admin-users", page, search, statusFilter],
        queryFn: () => adminService.getUsers(page, 15, search, statusFilter),
    });

    const users: User[] = result?.users ?? [];
    const totalPages = result?.pagination?.totalPages ?? 1;

    const handleRoleToggle = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!confirm(`Change role to ${newRole}?`)) return;
        try {
            await adminService.updateUserRole(userId, newRole as "user" | "admin");
            showToast(`Role updated to ${newRole}`, "success");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        } catch {
            showToast("Failed to update role", "error");
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="space-y-4"
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-border bg-bg-elevated text-text-primary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer bg-position-[right_0.75rem_center] bg-no-repeat bg-size-[16px_16px] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239ca3af%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="relative bg-bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />

                {loading ? (
                    <div className="py-16">
                        <Loading />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-14 h-14 rounded-2xl bg-bg-muted flex items-center justify-center mx-auto mb-4">
                            <FiUsers size={24} className="text-text-tertiary" />
                        </div>
                        <p className="text-text-tertiary text-sm font-medium">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Name</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Email</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Role</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Portals</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Joined</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-b border-border/50 last:border-0 hover:bg-bg-elevated/40 transition-colors">
                                        <td className="py-3.5 px-4 font-semibold text-text-primary">{u.name}</td>
                                        <td className="py-3.5 px-4 text-text-secondary">{u.email}</td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-[#7C5CFC]/15 text-[#7C5CFC]" : "bg-bg-muted text-text-tertiary"
                                                }`}>
                                                {u.role === "admin" && <FiShield size={10} />}
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.subscriptionStatus === "active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                                                }`}>
                                                {u.subscriptionStatus}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-text-tertiary text-xs">
                                            {u.purchasedPortals?.join(", ") || "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-text-tertiary">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => handleRoleToggle(u._id, u.role)}
                                                className="text-xs text-primary hover:text-primary-hover font-semibold cursor-pointer transition-colors"
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
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl border border-border text-text-secondary hover:bg-bg-elevated transition-colors disabled:opacity-30 cursor-pointer"><FiChevronLeft size={14} /></button>
                            <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} className="p-2 rounded-xl border border-border text-text-secondary hover:bg-bg-elevated transition-colors disabled:opacity-30 cursor-pointer"><FiChevronRight size={14} /></button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
