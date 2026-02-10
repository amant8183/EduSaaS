import type { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    padding?: "sm" | "md" | "lg";
    hover?: boolean;
    className?: string;
}

const paddingStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export default function Card({
    children,
    padding = "md",
    hover = false,
    className = "",
}: CardProps) {
    return (
        <div
            className={`
        bg-bg-surface border border-border rounded-xl shadow-sm
        ${paddingStyles[padding]}
        ${hover ? "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
