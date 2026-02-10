import type { PortalFeature } from "../../services/pricingService";

interface Props {
    feature: PortalFeature;
    selected: boolean;
    onToggle: () => void;
}

export default function FeatureToggle({ feature, selected, onToggle }: Props) {
    return (
        <label className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-bg-muted/50 hover:bg-bg-muted transition-colors cursor-pointer group">
            <div className="flex items-center gap-3 min-w-0">
                {/* Toggle switch */}
                <div className="relative shrink-0">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={onToggle}
                        className="sr-only"
                    />
                    <div
                        className={`w-10 h-5.5 rounded-full transition-colors duration-200 ${selected ? "bg-primary" : "bg-border"
                            }`}
                    />
                    <div
                        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform duration-200 ${selected ? "translate-x-4.5" : "translate-x-0"
                            }`}
                    />
                </div>

                {/* Label */}
                <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                        {feature.name}
                    </p>
                    <p className="text-xs text-text-tertiary truncate">
                        {feature.description}
                    </p>
                </div>
            </div>

            {/* Price */}
            <span className="text-sm font-semibold text-text-secondary shrink-0">
                +₹{feature.price.toLocaleString()}/mo
            </span>
        </label>
    );
}
