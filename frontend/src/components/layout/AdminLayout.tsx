import { NavLink, Outlet } from "react-router-dom";
import {
    FiGrid,
    FiUsers,
    FiCreditCard,
    FiPackage,
} from "react-icons/fi";

const navItems = [
    { to: "/admin", icon: FiGrid, label: "Dashboard", end: true },
    { to: "/admin/users", icon: FiUsers, label: "Users" },
    { to: "/admin/subscriptions", icon: FiPackage, label: "Subscriptions" },
    { to: "/admin/payments", icon: FiCreditCard, label: "Payments" },
];

export default function AdminLayout() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Top nav tabs */}
            <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto">
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
            </div>

            <Outlet />
        </div>
    );
}
