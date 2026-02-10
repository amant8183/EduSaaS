import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiMail, FiCheckCircle } from "react-icons/fi";
import { authService } from "../services/authService";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
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
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card padding="lg">
                    <div className="text-center">
                        {/* Icon */}
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-6">
                            <FiMail size={28} className="text-primary" />
                        </div>

                        <h1 className="text-2xl font-bold text-text-primary mb-2">
                            Check your email
                        </h1>
                        <p className="text-text-secondary mb-2">
                            We&apos;ve sent a verification link to
                        </p>
                        {email && (
                            <p className="text-primary font-medium mb-6">{email}</p>
                        )}
                        <p className="text-sm text-text-tertiary mb-8">
                            Click the link in the email to verify your account. The link expires in 24 hours.
                        </p>

                        {/* Resend */}
                        {resent ? (
                            <div className="flex items-center justify-center gap-2 text-success text-sm font-medium">
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
                                className="text-primary font-medium hover:text-primary-hover transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
