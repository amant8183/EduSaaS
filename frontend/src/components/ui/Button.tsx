import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
    primary:
        "bg-primary text-text-inverse hover:bg-primary-hover focus-visible:ring-primary/40",
    secondary:
        "bg-bg-elevated text-text-primary border border-border hover:bg-bg-muted focus-visible:ring-border",
    danger:
        "bg-error text-white hover:bg-error/90 focus-visible:ring-error/40",
    ghost:
        "bg-transparent text-primary hover:bg-primary-light focus-visible:ring-primary/40",
};

const sizeStyles: Record<Size, string> = {
    sm: "h-8 px-3 text-sm gap-1.5 rounded-md",
    md: "h-10 px-4 text-[15px] gap-2 rounded-md",
    lg: "h-12 px-6 text-base gap-2.5 rounded-md",
};

export default function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    fullWidth = false,
    children,
    disabled,
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-150 ease-out
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        focus-visible:ring-2 focus-visible:ring-offset-2
        cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            {...props}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : icon ? (
                <span className="shrink-0">{icon}</span>
            ) : null}
            {children}
        </button>
    );
}
