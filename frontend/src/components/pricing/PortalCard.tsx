import { motion } from "framer-motion";
import { FiCheck, FiLock } from "react-icons/fi";
import type { Portal } from "../../services/pricingService";

interface Props {
    portal: Portal;
    selected: boolean;
    onToggle: () => void;
    billingCycle: "monthly" | "annual";
    owned?: boolean;
}

const portalIcons: Record<string, string> = {
    admin: "🏫",
    teacher: "👩‍🏫",
    student: "🎓",
};

const portalColors: Record<string, { ring: string; bg: string; badge: string; glow: string; borderAccent: string }> = {
    admin: {
        ring: "ring-[#7C5CFC]",
        bg: "bg-[#7C5CFC]/8",
        badge: "bg-[#7C5CFC]/15 text-[#7C5CFC]",
        glow: "shadow-[0_8px_30px_rgba(124,92,252,0.15)]",
        borderAccent: "border-[#7C5CFC]/30",
    },
    teacher: {
        ring: "ring-[#2DBDB6]",
        bg: "bg-[#2DBDB6]/8",
        badge: "bg-[#2DBDB6]/15 text-[#2DBDB6]",
        glow: "shadow-[0_8px_30px_rgba(45,189,182,0.15)]",
        borderAccent: "border-[#2DBDB6]/30",
    },
    student: {
        ring: "ring-[#F59E0B]",
        bg: "bg-[#F59E0B]/8",
        badge: "bg-[#F59E0B]/15 text-[#F59E0B]",
        glow: "shadow-[0_8px_30px_rgba(245,158,11,0.15)]",
        borderAccent: "border-[#F59E0B]/30",
    },
};

export default function PortalCard({ portal, selected, onToggle, billingCycle, owned }: Props) {
    const colors = portalColors[portal.id] || portalColors.admin;

    // Calculate displayed price based on billing cycle
    const isAnnual = billingCycle === "annual";
    const annualTotal = portal.basePrice * 10; // 10 months (save 2 months)
    const displayPrice = isAnnual ? Math.round(annualTotal / 12) : portal.basePrice;

    return (
        <motion.button
            whileHover={owned ? {} : { y: -4 }}
            whileTap={owned ? {} : { scale: 0.98 }}
            onClick={owned ? undefined : onToggle}
            disabled={owned}
            className={`
                relative w-full text-left rounded-2xl border-2 p-6
                transition-all duration-300 group
                ${owned
                    ? "opacity-60 cursor-not-allowed border-border"
                    : "cursor-pointer"
                }
                ${!owned && selected
                    ? `${colors.ring} ring-2 border-transparent ${colors.glow} ${colors.bg}`
                    : !owned
                        ? `border-border hover:${colors.borderAccent} hover:shadow-md`
                        : ""
                }
            `}
        >
            {/* Owned badge */}
            {owned && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">
                    <FiLock size={10} />
                    Owned
                </span>
            )}

            {/* Selected check */}
            {selected && !owned && (
                <span className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <FiCheck size={14} className="text-white" strokeWidth={3} />
                </span>
            )}

            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                <span className="text-2xl">{portalIcons[portal.id] || "📦"}</span>
            </div>

            {/* Title + Description */}
            <h3 className="text-xl font-bold text-text-primary mb-1">
                {portal.name}
            </h3>
            <p className="text-sm text-text-tertiary leading-relaxed mb-4 min-h-[40px]">
                {portal.description}
            </p>

            {/* Price */}
            <div className="mb-5 pb-5 border-b border-border">
                <span className="text-3xl font-extrabold text-text-primary">
                    ₹{displayPrice.toLocaleString()}
                </span>
                <span className="text-sm text-text-tertiary ml-1">/mo</span>
                {isAnnual && (
                    <p className="text-xs text-success mt-1 font-medium">
                        ₹{annualTotal.toLocaleString()}/yr · Save ₹{(portal.basePrice * 12 - annualTotal).toLocaleString()}
                    </p>
                )}
            </div>

            {/* Core features */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2.5">
                    Included
                </p>
                {portal.coreFeatures.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-sm text-text-secondary">
                        <FiCheck size={14} className="text-success shrink-0" />
                        {feat}
                    </div>
                ))}
            </div>

            {/* Add-on count badge */}
            {portal.availableFeatures.length > 0 && (
                <div className="mt-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                        +{portal.availableFeatures.length} add-ons available
                    </span>
                </div>
            )}
        </motion.button>
    );
}
