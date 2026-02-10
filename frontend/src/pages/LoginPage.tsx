import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import type { ApiError } from "../types";

export default function LoginPage() {
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const errs: typeof errors = {};
        if (!email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errs.email = "Enter a valid email";
        if (!password) errs.password = "Password is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await login({ email, password });
            showToast("Welcome back!", "success");
            navigate("/dashboard");
        } catch (err) {
            const apiErr = err as { response?: { data?: ApiError } };
            const msg = apiErr.response?.data?.message || "Login failed. Please try again.";
            showToast(msg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Welcome back
                    </h1>
                    <p className="text-text-secondary">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                <Card padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<FiMail size={18} />}
                            error={errors.email}
                            required
                            autoComplete="email"
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<FiLock size={18} />}
                            error={errors.password}
                            required
                            autoComplete="current-password"
                        />

                        {/* Forgot password link */}
                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary hover:text-primary-hover transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" fullWidth loading={loading} size="lg">
                            Sign In
                        </Button>
                    </form>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-text-secondary mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary font-medium hover:text-primary-hover transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
