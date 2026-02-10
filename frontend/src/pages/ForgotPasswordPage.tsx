import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {sent ? (
                    <Card padding="lg">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-success-light flex items-center justify-center mb-6">
                                <FiCheckCircle size={28} className="text-success" />
                            </div>
                            <h1 className="text-2xl font-bold text-text-primary mb-2">
                                Check your email
                            </h1>
                            <p className="text-text-secondary mb-2">
                                We sent a password reset link to
                            </p>
                            <p className="text-primary font-medium mb-6">{email}</p>
                            <p className="text-sm text-text-tertiary mb-6">
                                Didn&apos;t receive the email? Check your spam folder or try again.
                            </p>
                            <Button variant="secondary" onClick={() => setSent(false)} fullWidth>
                                Try Another Email
                            </Button>
                            <p className="text-sm text-text-secondary mt-6">
                                <Link
                                    to="/login"
                                    className="text-primary font-medium hover:text-primary-hover transition-colors inline-flex items-center gap-1"
                                >
                                    <FiArrowLeft size={14} /> Back to login
                                </Link>
                            </p>
                        </div>
                    </Card>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-text-primary mb-2">
                                Forgot password?
                            </h1>
                            <p className="text-text-secondary">
                                Enter your email and we&apos;ll send you a reset link
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
                                    error={error}
                                    required
                                    autoComplete="email"
                                />

                                <Button type="submit" fullWidth loading={loading} size="lg">
                                    Send Reset Link
                                </Button>
                            </form>
                        </Card>

                        <p className="text-center text-sm text-text-secondary mt-6">
                            <Link
                                to="/login"
                                className="text-primary font-medium hover:text-primary-hover transition-colors inline-flex items-center gap-1"
                            >
                                <FiArrowLeft size={14} /> Back to login
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
