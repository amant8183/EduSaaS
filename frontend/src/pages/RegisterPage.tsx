import { useState, useMemo, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import type { ApiError } from "../types";

// ===== Password Strength =====
function getStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;

    const map: Record<number, { label: string; color: string }> = {
        0: { label: "Too short", color: "bg-text-tertiary" },
        1: { label: "Weak", color: "bg-error" },
        2: { label: "Fair", color: "bg-warning" },
        3: { label: "Good", color: "bg-info" },
        4: { label: "Strong", color: "bg-success" },
    };
    return { score, ...map[score] };
}

function PasswordStrength({ password }: { password: string }) {
    const { score, label, color } = useMemo(() => getStrength(password), [password]);

    if (!password) return null;

    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-200 ${i <= score ? color : "bg-border"
                            }`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium ${score >= 3 ? "text-success" : score >= 2 ? "text-warning" : "text-error"}`}>
                {label}
            </p>
        </div>
    );
}

// ===== Register Page =====
export default function RegisterPage() {
    const { register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!name.trim()) errs.name = "Name is required";
        if (!email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errs.email = "Enter a valid email";
        if (!password) errs.password = "Password is required";
        else if (password.length < 8)
            errs.password = "Must be at least 8 characters";
        if (password !== confirmPassword)
            errs.confirmPassword = "Passwords do not match";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const message = await register({ name, email, password });
            showToast(message || "Registration successful! Check your email.", "success");
            navigate("/verify-email", { state: { email } });
        } catch (err) {
            const apiErr = err as { response?: { data?: ApiError } };
            const msg = apiErr.response?.data?.message || "Registration failed.";
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
                        Create your account
                    </h1>
                    <p className="text-text-secondary">
                        Get started with your free account
                    </p>
                </div>

                <Card padding="lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={<FiUser size={18} />}
                            error={errors.name}
                            required
                            autoComplete="name"
                        />

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

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<FiLock size={18} />}
                                error={errors.password}
                                required
                                autoComplete="new-password"
                            />
                            <PasswordStrength password={password} />
                        </div>

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={<FiLock size={18} />}
                            error={errors.confirmPassword}
                            required
                            autoComplete="new-password"
                        />

                        <Button type="submit" fullWidth loading={loading} size="lg">
                            Create Account
                        </Button>
                    </form>
                </Card>

                {/* Footer */}
                <p className="text-center text-sm text-text-secondary mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary font-medium hover:text-primary-hover transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
