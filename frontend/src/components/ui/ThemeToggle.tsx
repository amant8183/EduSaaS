import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        const stored = localStorage.getItem("theme");
        if (stored) return stored === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark((prev) => !prev)}
            className="relative w-10 h-10 flex items-center justify-center rounded-md text-text-primary hover:bg-bg-elevated transition-all duration-300 cursor-pointer group"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
        >
            <span
                className="inline-flex transition-transform duration-300"
                style={{ transform: isDark ? "rotate(180deg)" : "rotate(0deg)" }}
            >
                {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </span>

            {/* Hover scale effect */}
            <span className="absolute inset-0 rounded-md transition-transform duration-150 group-hover:scale-105 group-active:scale-95" />
        </button>
    );
}
