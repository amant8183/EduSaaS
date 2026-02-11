import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import { authService } from "../services/authService";

export default function VerifyEmailCallbackPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link. No token provided.");
            return;
        }

        authService
            .verifyEmail(token)
            .then((res) => {
                setStatus("success");
                setMessage(res.message || "Your email has been verified successfully!");
            })
            .catch((err) => {
                setStatus("error");
                const apiMsg =
                    err?.response?.data?.message || "Verification failed. The link may be expired or invalid.";
                setMessage(apiMsg);
            });
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-md"
            >
                <div className="relative bg-bg-surface border border-border rounded-2xl p-8 shadow-sm overflow-hidden text-center">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-accent" />

                    {status === "loading" && (
                        <>
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mt-1">
                                <FiLoader size={28} className="text-primary animate-spin" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                                Verifying your email...
                            </h1>
                            <p className="text-text-secondary">Please wait a moment.</p>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-6 mt-1">
                                <FiCheckCircle size={28} className="text-success" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                                Email{" "}
                                <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                                    Verified!
                                </span>
                            </h1>
                            <p className="text-text-secondary mb-6">{message}</p>
                            <Link
                                to="/login"
                                className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors"
                            >
                                Sign in to your account
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mb-6 mt-1">
                                <FiXCircle size={28} className="text-error" />
                            </div>
                            <h1 className="text-2xl font-extrabold text-text-primary mb-2">
                                Verification Failed
                            </h1>
                            <p className="text-text-secondary mb-6">{message}</p>
                            <Link
                                to="/login"
                                className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-hover transition-colors"
                            >
                                Go to Login
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
