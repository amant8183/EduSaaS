import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import type { Portal } from "../../services/pricingService";

interface Props {
    portal: Portal;
    selected: boolean;
    onToggle: () => void;
}

// ... icons and colors remain same ...
const portalIcons: Record<string, string> = {
    admin: "🏫",
    teacher: "👩‍🏫",
    student: "🎓",
};

const portalColors: Record<string, { ring: string; bg: string; badge: string }> = {
    admin: {
        ring: "ring-[#7C5CFC]",
        bg: "bg-[#7C5CFC]/8",
        badge: "bg-[#7C5CFC]/15 text-[#7C5CFC]",
    },
    teacher: {
        ring: "ring-[#2DBDB6]",
        bg: "bg-[#2DBDB6]/8",
        badge: "bg-[#2DBDB6]/15 text-[#2DBDB6]",
    },
    student: {
        ring: "ring-[#F59E0B]",
        bg: "bg-[#F59E0B]/8",
        badge: "bg-[#F59E0B]/15 text-[#F59E0B]",
    },
};

export default function PortalCard({ portal, selected, onToggle }: Props) {
    const colors = portalColors[portal.id] || portalColors.admin;

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggle}
            className={`
        relative w-full text-left rounded-xl border-2 p-6
        transition-colors duration-200 cursor-pointer group
        ${selected
                    ? `${colors.ring} ring-2 border-transparent shadow-lg ${colors.bg}`
                    : "border-border hover:border-text-tertiary hover:shadow-md"
                }
      `}
        >
            {/* Selected check */}
            {selected && (
                <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <FiCheck size={14} className="text-white" />
                </span>
            )}

            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{portalIcons[portal.id] || "📦"}</span>
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                        {portal.name}
                    </h3>
                    <p className="text-sm text-text-tertiary">{portal.description}</p>
                </div>
            </div>

            {/* Price */}
            <div className="mb-4">
                <span className="text-2xl font-bold text-text-primary">
                    ₹{portal.basePrice.toLocaleString()}
                </span>
                <span className="text-sm text-text-tertiary">/mo</span>
            </div>

            {/* Core features */}
            <div className="space-y-1.5">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                    Included
                </p>
                {portal.coreFeatures.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-sm text-text-secondary">
                        <FiCheck size={14} className="text-success shrink-0" />
                        {feat}
                    </div>
                ))}
            </div>

            {/* Add-on count badge */}
            {portal.availableFeatures.length > 0 && (
                <div className="mt-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
                        +{portal.availableFeatures.length} add-ons available
                    </span>
                </div>
            )}
        </motion.button>
    );
}
