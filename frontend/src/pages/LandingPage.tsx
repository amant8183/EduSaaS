import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiUsers, FiBookOpen, FiShield, FiZap } from "react-icons/fi";
import { motion, type Variants } from "framer-motion";

const portals = [
    {
        id: "admin",
        name: "School Admin Portal",
        description: "Complete control over students, teachers, and school operations.",
        basePrice: 2000,
        icon: "🏫",
        features: ["User Management", "Role Assignment", "Audit Logs", "Analytics Dashboard"],
        color: "text-[#7C5CFC]",
        bg: "bg-[#7C5CFC]/10",
        borderAccent: "group-hover:border-[#7C5CFC]/30",
        glowColor: "group-hover:shadow-[0_8px_30px_rgba(124,92,252,0.12)]",
    },
    {
        id: "teacher",
        name: "Teacher Portal",
        description: "Tools for lesson planning, grading, and student progress tracking.",
        basePrice: 800,
        icon: "👩‍🏫",
        features: ["Gradebook", "Attendance", "Assignments", "Progress Reports"],
        color: "text-[#2DBDB6]",
        bg: "bg-[#2DBDB6]/10",
        borderAccent: "group-hover:border-[#2DBDB6]/30",
        glowColor: "group-hover:shadow-[0_8px_30px_rgba(45,189,182,0.12)]",
    },
    {
        id: "student",
        name: "Student Portal",
        description: "Access to learning materials, grades, and interactive assignments.",
        basePrice: 400,
        icon: "🎓",
        features: ["Course Materials", "Grade View", "Online Tests", "Study Resources"],
        color: "text-[#F59E0B]",
        bg: "bg-[#F59E0B]/10",
        borderAccent: "group-hover:border-[#F59E0B]/30",
        glowColor: "group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]",
    },
];

const stats = [
    { value: "10K+", label: "Students Managed" },
    { value: "500+", label: "Schools Trust Us" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" },
];

const highlights = [
    { icon: FiShield, title: "Secure & Reliable", desc: "Enterprise-grade security with role-based access control." },
    { icon: FiZap, title: "Lightning Fast", desc: "Optimized for speed with real-time data synchronization." },
    { icon: FiBookOpen, title: "Easy to Use", desc: "Intuitive interface designed for educators, not engineers." },
    { icon: FiUsers, title: "Scalable", desc: "From a single classroom to an entire district." },
];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen overflow-hidden">

            {/* ════════════ HERO ════════════ */}
            <section className="relative px-4 pt-24 pb-20 text-center md:pt-36 md:pb-28">
                {/* Background glow */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
                    <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/6 blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mx-auto max-w-4xl"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-semibold tracking-wide uppercase rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Now with Razorpay Integration
                    </motion.div>

                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-text-primary md:text-6xl lg:text-7xl leading-[1.1]">
                        All-in-One{" "}
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            Education Platform
                        </span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary md:text-xl leading-relaxed">
                        Manage your school, empower teachers, and engage students — all from
                        a single, modern platform with flexible pricing.
                    </p>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => navigate("/register")}
                            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary-hover transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                        >
                            Get Started
                            <FiArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <button
                            onClick={() => navigate("/pricing")}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-border text-text-primary font-medium text-base hover:bg-bg-elevated transition-all duration-200 cursor-pointer"
                        >
                            View Pricing
                        </button>
                    </div>
                </motion.div>

                {/* Stats bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mx-auto mt-16 max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center px-4">
                            <p className="text-2xl md:text-3xl font-extrabold text-text-primary">{stat.value}</p>
                            <p className="text-xs md:text-sm text-text-tertiary mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ════════════ WHY US ════════════ */}
            <section className="px-4 py-20 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="text-center mb-14"
                    >
                        <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                            Why EduSaaS?
                        </motion.p>
                        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-text-primary">
                            Built for Modern Schools
                        </motion.h2>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {highlights.map((item, i) => (
                            <motion.div
                                key={item.title}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={fadeUp}
                                className="group p-6 rounded-2xl border border-border bg-bg-surface hover:bg-bg-elevated/60 transition-all duration-300 hover:shadow-md"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                                    <item.icon size={20} className="text-primary" />
                                </div>
                                <h3 className="text-base font-semibold text-text-primary mb-1.5">{item.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ PORTALS ════════════ */}
            <section className="bg-bg-muted/40 px-4 py-20 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="text-center mb-14"
                    >
                        <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                            Portals
                        </motion.p>
                        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Three Powerful Portals
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-xl text-text-secondary">
                            Each portal is tailored to its audience — admins, teachers, and students get exactly what they need.
                        </motion.p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {portals.map((portal, index) => (
                            <motion.div
                                key={portal.id}
                                custom={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={fadeUp}
                                className={`group relative bg-bg-surface border border-border rounded-2xl p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 ${portal.borderAccent} ${portal.glowColor}`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${portal.bg} flex items-center justify-center mb-5`}>
                                    <span className="text-2xl">{portal.icon}</span>
                                </div>

                                <h3 className="text-xl font-bold text-text-primary mb-2">{portal.name}</h3>
                                <p className="text-text-secondary text-sm mb-6 leading-relaxed min-h-[44px]">
                                    {portal.description}
                                </p>

                                <div className="mb-6 pb-6 border-b border-border">
                                    <span className="text-3xl font-extrabold text-text-primary">₹{portal.basePrice}</span>
                                    <span className="text-sm text-text-tertiary ml-1">/mo per user</span>
                                </div>

                                <ul className="space-y-3">
                                    {portal.features.map((feat) => (
                                        <li key={feat} className="flex items-center gap-2.5 text-sm text-text-secondary">
                                            <FiCheckCircle size={16} className={`shrink-0 ${portal.color}`} />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => navigate("/pricing")}
                                    className="mt-6 w-full py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:bg-bg-elevated transition-colors cursor-pointer"
                                >
                                    Learn More →
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════ CTA ════════════ */}
            <section className="px-4 py-24 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <div className="relative rounded-3xl border border-border bg-bg-surface p-10 md:p-16 overflow-hidden">
                        {/* Background accent */}
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/8 blur-[80px]" />
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-accent/6 blur-[80px]" />
                        </div>

                        <h2 className="mb-4 text-3xl md:text-4xl font-bold text-text-primary leading-tight">
                            Ready to Transform{" "}
                            <span className="text-primary">Your School?</span>
                        </h2>
                        <p className="mx-auto mb-8 max-w-lg text-text-secondary leading-relaxed">
                            Choose the portals and features you need. Pay only for what you use.
                            Start free — no credit card required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate("/register")}
                                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                            >
                                Create Your Account
                                <FiArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                            </button>
                            <button
                                onClick={() => navigate("/pricing")}
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border text-text-primary font-medium hover:bg-bg-elevated transition-all duration-200 cursor-pointer"
                            >
                                View Pricing
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ════════════ FOOTER ════════════ */}
            <footer className="border-t border-border bg-bg-muted/30 px-4 py-8">
                <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-text-tertiary">
                        © {new Date().getFullYear()} EduSaaS. Built for demo purposes.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-xs text-text-tertiary">Powered by Razorpay</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
