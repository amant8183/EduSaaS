// Valid portal and billing cycle constants
export const VALID_PORTALS = ["admin", "teacher", "student"] as const;
export const VALID_BILLING_CYCLES = ["monthly", "annual"] as const;

export type PortalType = typeof VALID_PORTALS[number];
export type BillingCycle = typeof VALID_BILLING_CYCLES[number];

// Portal base prices (in INR per month) — mutable for admin updates
let PORTAL_PRICES: Record<PortalType, number> = {
    admin: 2000,
    teacher: 800,
    student: 400,
};

// Feature add-on prices (in INR per month) — mutable for admin updates
let FEATURE_PRICES: Record<string, number> = {
    // Admin Portal Features
    fee_management: 500,
    exam_management: 400,
    transport_management: 300,
    library_management: 200,
    parent_communication: 250,
    // Teacher Portal Features
    gradebook: 300,
    lesson_planning: 200,
    student_analytics: 250,
    digital_content: 150,
    // Student Portal Features
    grade_access: 150,
    learning_resources: 200,
    communication_hub: 100,
    exam_preparation: 250,
};

// Features available for each portal
export const PORTAL_FEATURES: Record<PortalType, string[]> = {
    admin: ["fee_management", "exam_management", "transport_management", "library_management", "parent_communication"],
    teacher: ["gradebook", "lesson_planning", "student_analytics", "digital_content"],
    student: ["grade_access", "learning_resources", "communication_hub", "exam_preparation"],
};

// Portal display information
export const PORTAL_INFO: Record<PortalType, { name: string; description: string; coreFeatures: string[] }> = {
    admin: {
        name: "School Admin Portal",
        description: "Complete school administration and management",
        coreFeatures: ["Dashboard Overview", "Student Management", "Staff Management", "Basic Reports"],
    },
    teacher: {
        name: "Teacher Portal",
        description: "Classroom and teaching management tools",
        coreFeatures: ["Class Dashboard", "Attendance Management", "Assignment Management"],
    },
    student: {
        name: "Student Portal",
        description: "Student learning and progress tracking",
        coreFeatures: ["Personal Dashboard", "Assignment Submission", "Attendance View"],
    },
};

// Feature display information
export const FEATURE_INFO: Record<string, { name: string; description: string }> = {
    fee_management: { name: "Fee Management", description: "Track and manage student fee payments" },
    exam_management: { name: "Exam & Result Management", description: "Create exams and manage results" },
    transport_management: { name: "Transport Management", description: "Manage school transport routes" },
    library_management: { name: "Library Management", description: "Track library books and borrowing" },
    parent_communication: { name: "Parent Communication", description: "Send updates to parents" },
    gradebook: { name: "Gradebook & Assessment", description: "Manage grades and assessments" },
    lesson_planning: { name: "Lesson Planning", description: "Plan and organize lessons" },
    student_analytics: { name: "Student Analytics", description: "View student performance analytics" },
    digital_content: { name: "Digital Content Library", description: "Access teaching materials" },
    grade_access: { name: "Grade & Report Access", description: "View grades and reports" },
    learning_resources: { name: "Learning Resources", description: "Access study materials" },
    communication_hub: { name: "Communication Hub", description: "Communicate with teachers" },
    exam_preparation: { name: "Exam Preparation", description: "Practice tests and preparation" },
};

// Bundle discount configurations — mutable for admin updates
let BUNDLE_DISCOUNTS: Record<string, number> = {
    admin_teacher: 0.15,
    teacher_student: 0.10,
    all_three: 0.20,
};

// Billing cycle multipliers (annual = 10 months for 12)
export const BILLING_MULTIPLIERS: Record<BillingCycle, number> = {
    monthly: 1,
    annual: 10,
};

// Price calculation result interface
export interface PriceBreakdown {
    basePrice: number;
    addOnPrice: number;
    subtotal: number;
    discountPercentage: number;
    discountAmount: number;
    total: number;
    billingCycle: BillingCycle;
    portals: { id: string; name: string; price: number }[];
    features: { id: string; name: string; price: number }[];
}

// ===== Admin getters/setters =====

/** Returns the full pricing config for admin panel */
export function getFullPricingConfig() {
    return {
        portalPrices: { ...PORTAL_PRICES },
        featurePrices: Object.entries(FEATURE_PRICES).map(([id, price]) => ({
            id,
            name: FEATURE_INFO[id]?.name || id,
            description: FEATURE_INFO[id]?.description || "",
            portal: Object.entries(PORTAL_FEATURES).find(([_, feats]) => feats.includes(id))?.[0] || "",
            price,
        })),
        bundleDiscounts: Object.entries(BUNDLE_DISCOUNTS).map(([id, discount]) => ({
            id,
            name: id === "admin_teacher" ? "Admin + Teacher Bundle"
                : id === "teacher_student" ? "Teacher + Student Bundle"
                    : "Complete School Bundle",
            discount: Math.round(discount * 100),
        })),
    };
}

/** Update portal prices (partial updates allowed) */
export function updatePortalPrices(updates: Partial<Record<PortalType, number>>) {
    for (const [portal, price] of Object.entries(updates)) {
        if ((VALID_PORTALS as readonly string[]).includes(portal) && typeof price === "number" && price >= 0) {
            PORTAL_PRICES[portal as PortalType] = price;
        }
    }
}

/** Update feature prices (partial updates allowed) */
export function updateFeaturePrices(updates: Record<string, number>) {
    for (const [featureId, price] of Object.entries(updates)) {
        if (featureId in FEATURE_PRICES && typeof price === "number" && price >= 0) {
            FEATURE_PRICES[featureId] = price;
        }
    }
}

/** Update bundle discount percentages (input as 0-100) */
export function updateBundleDiscounts(updates: Record<string, number>) {
    for (const [id, pct] of Object.entries(updates)) {
        if (id in BUNDLE_DISCOUNTS && typeof pct === "number" && pct >= 0 && pct <= 100) {
            BUNDLE_DISCOUNTS[id] = pct / 100;
        }
    }
}

/**
 * Calculate the total price based on selected portals and features
 */
export function calculatePrice(
    selectedPortals: string[],
    selectedFeatures: string[],
    billingCycle: BillingCycle = "monthly"
): PriceBreakdown {
    const multiplier = BILLING_MULTIPLIERS[billingCycle];

    // Calculate base price for portals
    let basePrice = 0;
    const portalsBreakdown = selectedPortals.map(portal => {
        const price = PORTAL_PRICES[portal as PortalType] || 0;
        basePrice += price;
        return { id: portal, name: PORTAL_INFO[portal as PortalType]?.name || portal, price };
    });

    // Calculate add-on price for features (only for selected portals)
    let addOnPrice = 0;
    const featuresBreakdown: { id: string; name: string; price: number }[] = [];

    for (const feature of selectedFeatures) {
        const featurePortal = Object.entries(PORTAL_FEATURES).find(([_, features]) => features.includes(feature));
        if (featurePortal && selectedPortals.includes(featurePortal[0])) {
            const price = FEATURE_PRICES[feature] || 0;
            addOnPrice += price;
            featuresBreakdown.push({ id: feature, name: FEATURE_INFO[feature]?.name || feature, price });
        }
    }

    // Determine bundle discount
    const discountPercentage = getDiscountPercentage(selectedPortals);
    const subtotal = basePrice + addOnPrice;
    const discountAmount = Math.round(basePrice * discountPercentage);
    const total = (subtotal - discountAmount) * multiplier;

    return {
        basePrice: basePrice * multiplier,
        addOnPrice: addOnPrice * multiplier,
        subtotal: subtotal * multiplier,
        discountPercentage: discountPercentage * 100,
        discountAmount: discountAmount * multiplier,
        total,
        billingCycle,
        portals: portalsBreakdown.map(p => ({ ...p, price: p.price * multiplier })),
        features: featuresBreakdown.map(f => ({ ...f, price: f.price * multiplier })),
    };
}

/**
 * Get discount percentage based on selected portals
 */
function getDiscountPercentage(selectedPortals: string[]): number {
    if (selectedPortals.length === 3) return BUNDLE_DISCOUNTS.all_three;
    if (selectedPortals.length === 2) {
        const sorted = [...selectedPortals].sort();
        if (sorted.includes("admin") && sorted.includes("teacher")) return BUNDLE_DISCOUNTS.admin_teacher;
        if (sorted.includes("teacher") && sorted.includes("student")) return BUNDLE_DISCOUNTS.teacher_student;
        return 0.10; // Default for any 2 portals
    }
    return 0;
}

/**
 * Get all available portals with their info
 */
export function getAvailablePortals() {
    return VALID_PORTALS.map(id => ({
        id,
        ...PORTAL_INFO[id],
        basePrice: PORTAL_PRICES[id],
        availableFeatures: PORTAL_FEATURES[id].map(featureId => ({
            id: featureId,
            ...FEATURE_INFO[featureId],
            price: FEATURE_PRICES[featureId],
        })),
    }));
}

/**
 * Get all available features grouped by portal
 */
export function getAvailableFeatures() {
    return VALID_PORTALS.map(portalId => ({
        portalId,
        portalName: PORTAL_INFO[portalId].name,
        features: PORTAL_FEATURES[portalId].map(featureId => ({
            id: featureId,
            ...FEATURE_INFO[featureId],
            price: FEATURE_PRICES[featureId],
        })),
    }));
}

/**
 * Get bundle discount information for display
 */
export function getBundleDiscountInfo() {
    return [
        { id: "admin_teacher", name: "Admin + Teacher Bundle", discount: BUNDLE_DISCOUNTS.admin_teacher * 100, description: `${Math.round(BUNDLE_DISCOUNTS.admin_teacher * 100)}% off Admin and Teacher portals together` },
        { id: "teacher_student", name: "Teacher + Student Bundle", discount: BUNDLE_DISCOUNTS.teacher_student * 100, description: `${Math.round(BUNDLE_DISCOUNTS.teacher_student * 100)}% off Teacher and Student portals together` },
        { id: "all_three", name: "Complete School Bundle", discount: BUNDLE_DISCOUNTS.all_three * 100, description: `${Math.round(BUNDLE_DISCOUNTS.all_three * 100)}% off all three portals` },
    ];
}
