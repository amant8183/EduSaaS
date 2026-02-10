import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    error?: string;
    icon?: ReactNode;
    rightIcon?: ReactNode;
}

export default function Input({
    label,
    error,
    icon,
    rightIcon,
    type = "text",
    required,
    className = "",
    id,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-text-secondary mb-2"
                >
                    {label}
                    {required && <span className="text-error ml-0.5">*</span>}
                </label>
            )}

            <div className="relative">
                {/* Left icon */}
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
                        {icon}
                    </span>
                )}

                <input
                    id={inputId}
                    type={isPassword && showPassword ? "text" : type}
                    className={`
            w-full h-12 bg-bg-surface text-text-primary text-[15px]
            border rounded-lg outline-none
            transition-all duration-150
            placeholder:text-text-tertiary
            ${icon ? "pl-10" : "pl-4"}
            ${isPassword || rightIcon ? "pr-11" : "pr-4"}
            ${error
                            ? "border-error focus:border-error focus:ring-3 focus:ring-error/15"
                            : "border-border focus:border-primary focus:ring-3 focus:ring-primary/15"
                        }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
                    required={required}
                    {...props}
                />

                {/* Password toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors p-1 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                    >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                )}

                {/* Right icon (non-password) */}
                {!isPassword && rightIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        {rightIcon}
                    </span>
                )}
            </div>

            {/* Error message */}
            {error && (
                <p className="mt-1.5 text-[13px] text-error flex items-center gap-1">
                    {error}
                </p>
            )}
        </div>
    );
}
