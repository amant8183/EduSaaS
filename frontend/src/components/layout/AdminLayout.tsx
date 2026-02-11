import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiGrid,
    FiUsers,
    FiCreditCard,
    FiPackage,
    FiSettings,
} from "react-icons/fi";

const navItems = [
    { to: "/admin", icon: FiGrid, label: "Dashboard", end: true },
    { to: "/admin/users", icon: FiUsers, label: "Users" },
    { to: "/admin/subscriptions", icon: FiPackage, label: "Subscriptions" },
    { to: "/admin/payments", icon: FiCreditCard, label: "Payments" },
    { to: "/admin/plans", icon: FiSettings, label: "Plans" },
];

export default function AdminLayout() {
    return (
        <div className="min-h-screen overflow-hidden">
            {/* Background glow */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/4 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-6 md:pt-28">
                {/* Top nav tabs */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex items-center gap-1 border-b border-border mb-8 overflow-x-auto"
                >
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${isActive
                                    ? "border-primary text-primary"
                                    : "border-transparent text-text-tertiary hover:text-text-primary"
                                }`
                            }
                        >
                            <item.icon size={16} />
                            {item.label}
                        </NavLink>
                    ))}
                </motion.div>

                <Outlet />
            </div>
        </div>
    );
}
