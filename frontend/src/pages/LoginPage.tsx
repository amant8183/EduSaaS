import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
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
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/6 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                        <FiLogIn size={24} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-text-primary mb-2">
                        Welcome{" "}
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            back
                        </span>
                    </h1>
                    <p className="text-text-secondary">
                        Sign in to continue to your dashboard
                    </p>
                </div>

                {/* Card */}
                <div className="relative bg-bg-surface border border-border rounded-2xl p-7 shadow-sm overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />

                    <form onSubmit={handleSubmit} className="space-y-5 mt-1">
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
                                className="text-sm text-primary font-medium hover:text-primary-hover transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" fullWidth loading={loading} size="lg">
                            Sign In
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-text-secondary mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary font-semibold hover:text-primary-hover transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
