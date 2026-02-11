import { useState, type FormEvent } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import type { ApiError } from "../types";

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
            <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/6 blur-[100px]" />
        </div>
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md"
        >
            {children}
        </motion.div>
    </div>
);

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

    const validate = () => {
        const errs: typeof errors = {};
        if (!password) errs.password = "Password is required";
        else if (password.length < 8)
            errs.password = "Must be at least 8 characters";
        if (password !== confirmPassword) errs.confirm = "Passwords do not match";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (!token) {
            showToast("Invalid or missing reset token.", "error");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(token, password);
            setSuccess(true);
            showToast("Password reset successfully!", "success");
        } catch (err) {
            const apiErr = err as { response?: { data?: ApiError } };
            showToast(apiErr.response?.data?.message || "Failed to reset password.", "error");
        } finally {
            setLoading(false);
        }
    };

    // ── Invalid token ──
    if (!token) {
        return (
            <Wrapper>
                <div className="relative bg-bg-surface border border-border rounded-2xl p-8 shadow-sm overflow-hidden text-center">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-warning to-error" />
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center mb-6 mt-1">
                        <FiAlertTriangle size={28} className="text-warning" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-text-primary mb-2">Invalid Link</h1>
                    <p className="text-text-secondary mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Button onClick={() => navigate("/forgot-password")} fullWidth>
                        Request New Link
                    </Button>
                </div>
            </Wrapper>
        );
    }

    // ── Success state ──
    if (success) {
        return (
            <Wrapper>
                <div className="relative bg-bg-surface border border-border rounded-2xl p-8 shadow-sm overflow-hidden text-center">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-success to-accent" />
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-6 mt-1">
                        <FiCheckCircle size={28} className="text-success" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                        Password Reset!
                    </h1>
                    <p className="text-text-secondary mb-6">
                        Your password has been updated successfully.
                    </p>
                    <Link to="/login">
                        <Button fullWidth>Sign In</Button>
                    </Link>
                </div>
            </Wrapper>
        );
    }

    // ── Form ──
    return (
        <Wrapper>
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <FiLock size={24} className="text-primary" />
                </div>
                <h1 className="text-3xl font-extrabold text-text-primary mb-2">
                    Set new{" "}
                    <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                        password
                    </span>
                </h1>
                <p className="text-text-secondary">
                    Enter your new password below
                </p>
            </div>

            {/* Card */}
            <div className="relative bg-bg-surface border border-border rounded-2xl p-7 shadow-sm overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />

                <form onSubmit={handleSubmit} className="space-y-5 mt-1">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<FiLock size={18} />}
                        error={errors.password}
                        required
                        autoComplete="new-password"
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={<FiLock size={18} />}
                        error={errors.confirm}
                        required
                        autoComplete="new-password"
                    />

                    <Button type="submit" fullWidth loading={loading} size="lg">
                        Reset Password
                    </Button>
                </form>
            </div>
        </Wrapper>
    );
}
