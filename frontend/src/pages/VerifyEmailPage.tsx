import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiCheckCircle } from "react-icons/fi";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import type { ApiError } from "../types";

export default function VerifyEmailPage() {
    const location = useLocation();
    const { showToast } = useToast();
    const email = (location.state as { email?: string })?.email || "";

    const [resending, setResending] = useState(false);
    const [resent, setResent] = useState(false);

    const handleResend = async () => {
        if (!email) {
            showToast("No email address found. Please register again.", "error");
            return;
        }

        setResending(true);
        try {
            await authService.resendVerification(email);
            setResent(true);
            showToast("Verification email sent!", "success");
        } catch (err) {
            const apiErr = err as { response?: { data?: ApiError } };
            showToast(apiErr.response?.data?.message || "Failed to resend.", "error");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
                <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-accent/6 blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-md"
            >
                <div className="relative bg-bg-surface border border-border rounded-2xl p-8 shadow-sm overflow-hidden text-center">
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />

                    {/* Icon */}
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mt-1">
                        <FiMail size={28} className="text-primary" />
                    </div>

                    <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                        Check your{" "}
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            email
                        </span>
                    </h1>
                    <p className="text-text-secondary mb-2">
                        We&apos;ve sent a verification link to
                    </p>
                    {email && (
                        <p className="text-primary font-semibold mb-6">{email}</p>
                    )}
                    <p className="text-sm text-text-tertiary mb-8 leading-relaxed">
                        Click the link in the email to verify your account. The link expires in 24 hours.
                    </p>

                    {/* Resend */}
                    {resent ? (
                        <div className="flex items-center justify-center gap-2 text-success text-sm font-semibold bg-success/10 rounded-xl py-3">
                            <FiCheckCircle size={16} />
                            Email sent successfully
                        </div>
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={handleResend}
                            loading={resending}
                            fullWidth
                        >
                            Resend Verification Email
                        </Button>
                    )}

                    {/* Back to login */}
                    <p className="text-sm text-text-secondary mt-6">
                        Already verified?{" "}
                        <Link
                            to="/login"
                            className="text-primary font-semibold hover:text-primary-hover transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
