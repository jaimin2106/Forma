"use client";

import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, LayoutGrid, BarChart2, CheckCircle2 } from "lucide-react";
import { motion, useInView } from "framer-motion";

// --- Data & Types ---
interface FinalCTASectionProps {
    user: any;
}

const freePlanFeatures = [
    { icon: Layers, title: "Unlimited Forms", description: "Create as many forms as you need, with no limits." },
    { icon: LayoutGrid, title: "3,000+ Templates", description: "Get a head start with a massive library of ready-to-use templates." },
    { icon: BarChart2, title: "Collect Responses", description: "Start gathering valuable data and insights from your audience right away." },
];

// --- Sub-Components ---
const FeatureCard = ({ icon: Icon, title, description }: typeof freePlanFeatures[0]) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { stiffness: 100, damping: 15 } }
    };

    return (
        <motion.div variants={cardVariants} whileHover={{ y: -8 }} className="relative p-8 bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl text-center group shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </motion.div>
    );
};


// --- Main Section Component ---
export const FinalCTASection = ({ user }: FinalCTASectionProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    };

    return (
        <section ref={ref} className="bg-white py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.1),_transparent_70%)]" />
                <motion.div
                    className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl opacity-60"
                    animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-3xl opacity-60"
                    animate={{ scale: [1, 1.1, 1], y: [0, -30, 0] }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 5 }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="text-center"
                >
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                        Try Forma for free
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed">
                        Our Free Plan has everything you need to start creating beautiful, effective forms today. No credit card required.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto"
                >
                    {freePlanFeatures.map((feature) => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col items-center justify-center"
                >
                    {user ? (
                        <Link to="/dashboard">
                            <Button size="lg" className="group bg-gray-900 text-white hover:bg-gray-800 text-lg px-10 py-7 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300">
                                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex flex-col items-center gap-6 w-full max-w-md">
                            <Link to="/auth" className="w-full">
                                <Button
                                    size="lg"
                                    className="group w-full bg-gray-900 text-white hover:bg-gray-800 text-lg px-8 py-7 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    Sign up for free
                                    <ArrowRight className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CheckCircle2 size={16} className="text-green-500" /> No credit card required
                                <span className="mx-2">•</span>
                                <CheckCircle2 size={16} className="text-green-500" /> Cancel anytime
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};