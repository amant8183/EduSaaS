import { useState, type FormEvent } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import type { ApiError } from "../types";

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

    if (!token) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
                <Card padding="lg">
                    <div className="text-center max-w-sm">
                        <h1 className="text-2xl font-bold text-text-primary mb-2">Invalid Link</h1>
                        <p className="text-text-secondary mb-6">
                            This password reset link is invalid or has expired.
                        </p>
                        <Button onClick={() => navigate("/forgot-password")} fullWidth>
                            Request New Link
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
                <Card padding="lg">
                    <div className="text-center max-w-sm">
                        <div className="mx-auto w-16 h-16 rounded-full bg-success-light flex items-center justify-center mb-6">
                            <FiCheckCircle size={28} className="text-success" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">
                            Password Reset!
                        </h1>
                        <p className="text-text-secondary mb-6">
                            Your password has been updated successfully.
                        </p>
                        <Link to="/login">
                            <Button fullWidth>Sign In</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Set new password
                    </h1>
                    <p className="text-text-secondary">
                        Enter your new password below
                    </p>
                </div>

                <Card padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                </Card>
            </div>
        </div>
    );
}
