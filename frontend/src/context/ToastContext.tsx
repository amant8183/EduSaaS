import {
    createContext,
    useState,
    useCallback,
    useRef,
    useEffect,
    type ReactNode,
} from "react";
import {
    FiCheckCircle,
    FiXCircle,
    FiInfo,
    FiX,
} from "react-icons/fi";

type ToastVariant = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextType {
    showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 0;

const DISMISS_MS = 3000;

// ===== Individual Toast Item =====
function ToastItem({
    toast,
    onDismiss,
}: {
    toast: Toast;
    onDismiss: (id: number) => void;
}) {
    const [progress, setProgress] = useState(100);
    const startTime = useRef(0);

    useEffect(() => {
        startTime.current = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime.current;
            const remaining = Math.max(0, 100 - (elapsed / DISMISS_MS) * 100);
            setProgress(remaining);
            if (remaining <= 0) clearInterval(timer);
        }, 30);

        return () => clearInterval(timer);
    }, []);

    const variantConfig: Record<
        ToastVariant,
        { bg: string; border: string; text: string; icon: ReactNode; bar: string }
    > = {
        success: {
            bg: "bg-success-light",
            border: "border-l-4 border-success",
            text: "text-success",
            icon: <FiCheckCircle size={20} />,
            bar: "bg-success",
        },
        error: {
            bg: "bg-error-light",
            border: "border-l-4 border-error",
            text: "text-error",
            icon: <FiXCircle size={20} />,
            bar: "bg-error",
        },
        info: {
            bg: "bg-info-light",
            border: "border-l-4 border-info",
            text: "text-info",
            icon: <FiInfo size={20} />,
            bar: "bg-info",
        },
    };

    const config = variantConfig[toast.variant];

    return (
        <div
            className={`relative min-w-[320px] max-w-[400px] rounded-xl shadow-lg overflow-hidden ${config.bg} ${config.border}`}
            style={{
                animation: "toastSlideIn 300ms ease-out",
            }}
        >
            {/* Content */}
            <div className="flex items-start gap-3 px-4 py-3">
                <span className={`mt-0.5 shrink-0 ${config.text}`}>
                    {config.icon}
                </span>
                <p className="text-sm font-medium text-text-primary flex-1">
                    {toast.message}
                </p>
                <button
                    onClick={() => onDismiss(toast.id)}
                    className="shrink-0 p-1 rounded text-text-tertiary hover:text-text-primary transition-opacity cursor-pointer"
                    aria-label="Dismiss"
                >
                    <FiX size={16} />
                </button>
            </div>

            {/* Progress bar */}
            <div className="h-0.5 w-full bg-transparent">
                <div
                    className={`h-full ${config.bar} transition-none`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

// ===== Toast Provider =====
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, variant: ToastVariant = "info") => {
            const id = ++nextId;
            setToasts((prev) => [...prev, { id, message, variant }]);
            setTimeout(() => dismiss(id), DISMISS_MS);
        },
        [dismiss]
    );

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast stack */}
            <div className="fixed top-6 right-6 z-9999 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onDismiss={dismiss} />
                    </div>
                ))}
            </div>

            {/* Keyframes */}
            <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
        </ToastContext.Provider>
    );
}

export { ToastContext };
