import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FiMenu,
    FiX,
    FiLogOut,
    FiShield,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../ui/ThemeToggle";
import Logo from "/logo.svg";

export default function Navbar() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Shadow on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    const prevPathRef = useRef(location.pathname);
    useEffect(() => {
        if (prevPathRef.current !== location.pathname) {
            prevPathRef.current = location.pathname;
            // Defer the state update to avoid setState-in-effect lint warning
            queueMicrotask(() => setMobileOpen(false));
        }
    }, [location.pathname]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    const linkClass = (path: string) =>
        `relative text-[15px] font-medium transition-colors duration-150 ${isActive(path)
            ? "text-primary"
            : "text-text-secondary hover:text-text-primary"
        }`;

    const activeDot = (path: string) =>
        isActive(path)
            ? "after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary"
            : "";

    return (
        <nav
            className={`sticky top-0 z-40 border-b border-border transition-shadow duration-200 ${scrolled
                ? "bg-bg-surface/80 backdrop-blur-sm"
                : "bg-bg-surface shadow-md"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <img src={Logo} alt="Logo" className="h-7 w-7" />
                        <span className="text-xl font-bold text-text-primary tracking-tight">
                            EduSaaS
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/pricing" className={`${linkClass("/pricing")} ${activeDot("/pricing")}`}>
                            Pricing
                        </Link>

                        {isAuthenticated && (
                            <Link to="/dashboard" className={`${linkClass("/dashboard")} ${activeDot("/dashboard")}`}>
                                Dashboard
                            </Link>
                        )}

                        {isAdmin && (
                            <Link to="/admin" className={`${linkClass("/admin")} ${activeDot("/admin")}`}>
                                <span className="flex items-center gap-1.5">
                                    <FiShield size={14} />
                                    Admin
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Desktop right section */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />

                        {isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="w-7.5 h-7.5 rounded-lg text-white font-bold text-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shadow-[0_2px_8px_rgba(139,124,246,0.4)] border border-white/20"
                                    style={{ background: "linear-gradient(145deg, #A99CF7 0%, #8B7CF6 35%, #7565E0 70%, #6554CC 100%)" }}
                                    aria-label="User menu"
                                >
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-bg-surface border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="text-sm font-semibold text-text-primary truncate">{user?.name}</p>
                                            <p className="text-xs text-text-tertiary truncate mt-0.5">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-bg-muted transition-colors cursor-pointer text-left mt-1"
                                        >
                                            <FiLogOut size={14} />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="px-3 py-2 text-sm font-medium text-text-primary rounded-xl hover:bg-bg-elevated transition-colors duration-150"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-2 text-sm font-medium bg-primary text-text-inverse rounded-xl hover:bg-primary-hover active:scale-[0.98] transition-all duration-150 shadow-sm"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile buttons */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-muted transition-colors cursor-pointer"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile drawer overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 top-16 z-30 bg-black/30 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            {mobileOpen && (
                <div
                    className="fixed top-16 right-0 z-40 h-[calc(100vh-64px)] w-72 bg-bg-surface border-l border-border shadow-lg md:hidden"
                >
                    <div className="flex flex-col p-6 gap-1">
                        <Link
                            to="/pricing"
                            className={`block px-4 py-3 rounded-xl transition-colors ${isActive("/pricing")
                                ? "bg-primary-light text-primary font-medium"
                                : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                                }`}
                        >
                            Pricing
                        </Link>

                        {isAuthenticated && (
                            <Link
                                to="/dashboard"
                                className={`block px-4 py-3 rounded-xl transition-colors ${isActive("/dashboard")
                                    ? "bg-primary-light text-primary font-medium"
                                    : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                                    }`}
                            >
                                Dashboard
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`flex items-center gap-1.5 px-4 py-3 rounded-xl transition-colors ${isActive("/admin")
                                    ? "bg-primary-light text-primary font-medium"
                                    : "text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                                    }`}
                            >
                                <FiShield size={15} />
                                Admin Panel
                            </Link>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-border my-4" />

                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-2 text-sm text-text-tertiary truncate">
                                    Signed in as <span className="text-text-primary font-medium">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-error hover:bg-error-light transition-colors cursor-pointer text-left"
                                >
                                    <FiLogOut size={16} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-3 text-center text-sm font-medium text-text-primary rounded-xl border border-border hover:bg-bg-muted transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-3 text-center text-sm font-medium bg-primary text-text-inverse rounded-xl hover:bg-primary-hover transition-colors shadow-sm"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
