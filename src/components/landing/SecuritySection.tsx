import { useState, useRef } from "react";
import { Shield, Lock, RefreshCw, CheckCircle, Server, FileCheck, Eye, Key } from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// --- Data for Security Features ---
const securityFeatures = {
    compliance: {
        icon: FileCheck,
        title: "Compliance & Access Control",
        features: ["GDPR-ready and HIPAA-compliant forms", "Single Sign-On (SSO) for secure access", "Custom roles and permissions for team management", "Full audit trails for accountability"],
        color: "#8b5cf6"
    },
    protection: {
        icon: Lock,
        title: "Data Protection & Encryption",
        features: ["End-to-end data and form encryption (AES-256)", "Multi-Factor Authentication (MFA)", "Regular vulnerability scanning and penetration testing", "Secure data centers with 24/7 monitoring"],
        color: "#ec4899"
    },
    reliability: {
        icon: Server,
        title: "System Reliability & Continuity",
        features: ["99.9% uptime SLA guarantee", "Built-in antispam protection (reCAPTCHA)", "Automated backup and recovery options", "Geographically redundant infrastructure"],
        color: "#10b981"
    },
};

type FeatureKey = keyof typeof securityFeatures;

// --- Main Section Component ---
export const SecuritySection = () => {
    const [activeFeature, setActiveFeature] = useState<FeatureKey>('protection');
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const selectedFeature = securityFeatures[activeFeature];
    const featureKeys = Object.keys(securityFeatures) as FeatureKey[];

    const containerVariants = {
        initial: {},
        animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    };

    const itemVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    };

    return (
        <section ref={ref} className="bg-[#F7F9FC] py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-[600px] h-[600px] bg-violet-200/40 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/2 -translate-y-1/2 -right-32 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100/50 border border-violet-200 text-violet-700 text-sm font-medium mb-6">
                        <Shield className="w-4 h-4" />
                        <span>Enterprise-Grade Security</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Security is not an afterthought. It's our foundation.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We know trust is essential. That's why we've built a fortress of security and compliance features to protect you and your users.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* LEFT: Interactive Shield */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ stiffness: 100, damping: 15, delay: 0.2 }}
                        className="relative h-[450px] flex items-center justify-center"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Central Hub */}
                        <div className="absolute w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center z-10 border border-gray-100">
                            <div className="absolute inset-0 rounded-full bg-violet-500/5 animate-pulse" />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature}
                                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <selectedFeature.icon className="w-24 h-24" style={{ color: selectedFeature.color }} />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Orbiting Elements */}
                        <motion.div
                            className="absolute w-full h-full"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                            style={{ animationPlayState: isHovered ? "paused" : "running" }}
                        >
                            <div className="absolute inset-0 rounded-full border border-dashed border-gray-300/50 scale-75" />
                            {featureKeys.map((key, index) => {
                                const angle = (index / featureKeys.length) * 360;
                                const isActive = activeFeature === key;
                                const Icon = securityFeatures[key].icon;
                                const color = securityFeatures[key].color;

                                return (
                                    <motion.div
                                        key={key}
                                        className="absolute top-1/2 left-1/2"
                                        style={{ transform: `rotate(${angle}deg) translateX(220px) rotate(-${angle}deg)` }}
                                    >
                                        <motion.button
                                            onClick={() => setActiveFeature(key)}
                                            className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 flex items-center justify-center cursor-pointer"
                                            whileHover={{ scale: 1.15, zIndex: 20 }}
                                            animate={{
                                                scale: isActive ? 1.2 : 1,
                                                boxShadow: isActive ? `0 0 0 4px ${color}30` : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                borderColor: isActive ? color : 'rgba(255,255,255,0.5)'
                                            }}
                                            transition={{ stiffness: 300, damping: 20 }}
                                        >
                                            <Icon className={`w-8 h-8 transition-colors duration-300`} style={{ color: isActive ? color : '#6b7280' }} />
                                        </motion.button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Feature Display */}
                    <div className="relative z-10 min-h-[320px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-xl"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex items-center gap-4 mb-6"
                                >
                                    <div className="p-3 rounded-xl bg-white shadow-sm border border-gray-100">
                                        <selectedFeature.icon className="w-8 h-8" style={{ color: selectedFeature.color }} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        {selectedFeature.title}
                                    </h3>
                                </motion.div>

                                <motion.ul
                                    variants={containerVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="space-y-4"
                                >
                                    {selectedFeature.features.map((feature) => (
                                        <motion.li key={feature} variants={itemVariants} className="flex items-start gap-3 group">
                                            <div className="mt-1 p-0.5 rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            </div>
                                            <span className="text-gray-700 text-lg leading-snug">{feature}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};