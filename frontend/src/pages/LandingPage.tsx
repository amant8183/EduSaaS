import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const portals = [
    {
        id: "admin",
        name: "School Admin Portal",
        description: "Complete control over students, teachers, and school operations.",
        basePrice: 2000,
        icon: "🏫",
        features: ["User Management", "Role Assignment", "Audit Logs"],
        color: "text-[#7C5CFC]",
        bg: "bg-[#7C5CFC]/10",
    },
    {
        id: "teacher",
        name: "Teacher Portal",
        description: "Tools for lesson planning, grading, and student progress tracking.",
        basePrice: 800,
        icon: "👩‍🏫",
        features: ["Gradebook", "Attendance", "Assignments"],
        color: "text-[#2DBDB6]",
        bg: "bg-[#2DBDB6]/10",
    },
    {
        id: "student",
        name: "Student Portal",
        description: "Access to learning materials, grades, and interactive assignments.",
        basePrice: 400,
        icon: "🎓",
        features: ["Course Materials", "Grade View", "Online Tests"],
        color: "text-[#F59E0B]",
        bg: "bg-[#F59E0B]/10",
    },
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative overflow-hidden px-4 py-24 text-center md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-4xl"
                >
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-text-primary md:text-6xl">
                        All-in-One <span className="text-primary">Education Platform</span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-text-secondary md:text-xl">
                        Manage your school, empower teachers, and engage students — all from a single, modern platform with flexible pricing.
                    </p>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => navigate("/pricing")}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
                        >
                            Get Started <FiArrowRight size={18} />
                        </button>
                        {/* Login button removed as per user request flow, generic secondary action if needed */}
                    </div>
                </motion.div>
            </section>

            {/* Portals */}
            <section className="bg-bg-muted/50 px-4 py-20">
                <div className="mx-auto max-w-6xl">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-12 text-center text-3xl font-bold text-text-primary"
                    >
                        Three Powerful Portals
                    </motion.h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        {portals.map((portal, index) => (
                            <motion.div
                                key={portal.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className={`w-12 h-12 rounded-lg ${portal.bg} flex items-center justify-center mb-4`}>
                                    <span className="text-2xl">{portal.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">{portal.name}</h3>
                                <p className="text-text-secondary text-sm mb-6 min-h-[40px]">
                                    {portal.description}
                                </p>
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-text-primary">₹{portal.basePrice}</span>
                                    <span className="text-sm text-text-tertiary">/mo base</span>
                                </div>
                                <ul className="space-y-3">
                                    {portal.features.map((feat) => (
                                        <li key={feat} className="flex items-center gap-2 text-sm text-text-secondary">
                                            <FiCheckCircle size={16} className={`shrink-0 ${portal.color}`} />
                                            {feat}
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-2 text-sm text-text-tertiary pl-6">
                                        + Optional Add-ons
                                    </li>
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-4 py-20 text-center">
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-4 text-3xl font-bold text-text-primary">Ready to Transform Your School?</h2>
                    <p className="mx-auto mb-8 max-w-xl text-text-secondary">
                        Choose the portals and features you need. Pay only for what you use.
                    </p>
                    <button
                        onClick={() => navigate("/pricing")}
                        className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
                    >
                        Create Your Account
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-bg-muted/30 px-4 py-8 text-center">
                <p className="text-sm text-text-tertiary">
                    © {new Date().getFullYear()} EduSaaS. Built for demo purposes.
                </p>
            </footer>
        </div>
    );
}

