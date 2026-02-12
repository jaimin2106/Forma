import { useRef } from "react";
import { Shield, Lock, Server, FileCheck, CheckCircle, Award } from "lucide-react";
import { motion, useInView } from "framer-motion";

// --- Security Features Data (Static Display) ---
const securityFeatures = [
    {
        icon: FileCheck,
        title: "Compliance & Access Control",
        features: [
            "GDPR-ready and HIPAA-compliant forms",
            "Single Sign-On (SSO) for secure access",
            "Custom roles and permissions",
            "Full audit trails"
        ],
        color: "#8b5cf6"
    },
    {
        icon: Lock,
        title: "Data Protection & Encryption",
        features: [
            "End-to-end encryption (AES-256)",
            "Multi-Factor Authentication (MFA)",
            "Regular vulnerability scanning",
            "24/7 security monitoring"
        ],
        color: "#ec4899"
    },
    {
        icon: Server,
        title: "System Reliability",
        features: [
            "99.9% uptime SLA guarantee",
            "Built-in antispam protection",
            "Automated backup & recovery",
            "Redundant infrastructure"
        ],
        color: "#10b981"
    },
];

// --- Compliance Badges ---
const complianceBadges = [
    { name: "SOC 2 Type II", icon: Award },
    { name: "GDPR", icon: Shield },
    { name: "HIPAA", icon: FileCheck },
    { name: "ISO 27001", icon: Lock },
];

// --- Security Feature Card Component ---
const SecurityFeatureCard = ({
    feature,
    index
}: {
    feature: typeof securityFeatures[0];
    index: number
}) => {
    const Icon = feature.icon;

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: index * 0.1 }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
            {/* Icon Header */}
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${feature.color}15` }}
            >
                <Icon className="w-6 h-6" style={{ color: feature.color }} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                {feature.title}
            </h3>

            {/* Feature List */}
            <ul className="space-y-3">
                {feature.features.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm leading-snug">{item}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

// --- Main Section Component (STATIC - No Interactive Shield) ---
export const SecuritySection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <section ref={ref} className="bg-white py-20 sm:py-24 relative overflow-hidden">
            <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-[500px] h-[500px] bg-violet-100/30 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-32 w-[500px] h-[500px] bg-sky-100/30 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-4">
                        <Shield className="w-4 h-4" />
                        <span>Enterprise-Grade Security</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                        Security is our foundation
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Built with enterprise-level security and compliance to protect you and your users.
                    </p>
                </motion.div>

                {/* Compliance Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-12"
                >
                    {complianceBadges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <motion.div
                                key={badge.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium text-slate-700"
                            >
                                <Icon className="w-4 h-4 text-violet-600" />
                                <span>{badge.name}</span>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Security Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {securityFeatures.map((feature, index) => (
                        <SecurityFeatureCard
                            key={feature.title}
                            feature={feature}
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};