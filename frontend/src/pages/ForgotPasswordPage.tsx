import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiCheckCircle, FiKey } from "react-icons/fi";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import type { ApiError } from "../types";

export default function ForgotPasswordPage() {
    const { showToast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Enter a valid email");
            return;
        }
        setError("");
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (err) {
            const apiErr = err as { response?: { data?: ApiError } };
            showToast(apiErr.response?.data?.message || "Something went wrong.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-accent/6 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-md"
            >
                {sent ? (
                    /* ── Success state ── */
                    <div className="relative bg-bg-surface border border-border rounded-2xl p-8 shadow-sm overflow-hidden text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-success to-accent" />

                        <div className="mx-auto w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-6 mt-1">
                            <FiCheckCircle size={28} className="text-success" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                            Check your email
                        </h1>
                        <p className="text-text-secondary mb-2">
                            We sent a password reset link to
                        </p>
                        <p className="text-primary font-semibold mb-6">{email}</p>
                        <p className="text-sm text-text-tertiary mb-6">
                            Didn&apos;t receive the email? Check your spam folder or try again.
                        </p>
                        <Button variant="secondary" onClick={() => setSent(false)} fullWidth>
                            Try Another Email
                        </Button>
                        <p className="text-sm text-text-secondary mt-6">
                            <Link
                                to="/login"
                                className="text-primary font-semibold hover:text-primary-hover transition-colors inline-flex items-center gap-1"
                            >
                                <FiArrowLeft size={14} /> Back to login
                            </Link>
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                                <FiKey size={24} className="text-primary" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-text-primary mb-2">
                                Forgot{" "}
                                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                                    password?
                                </span>
                            </h1>
                            <p className="text-text-secondary">
                                Enter your email and we&apos;ll send you a reset link
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
                                    error={error}
                                    required
                                    autoComplete="email"
                                />

                                <Button type="submit" fullWidth loading={loading} size="lg">
                                    Send Reset Link
                                </Button>
                            </form>
                        </div>

                        <p className="text-center text-sm text-text-secondary mt-6">
                            <Link
                                to="/login"
                                className="text-primary font-semibold hover:text-primary-hover transition-colors inline-flex items-center gap-1"
                            >
                                <FiArrowLeft size={14} /> Back to login
                            </Link>
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
}
