"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    Link, Copy, Check, Mail, Twitter, Linkedin, Users, Code, BarChart, Slack, FileText, ArrowRight, Globe, Share2
} from "lucide-react";

// --- High-Fidelity Mockup Components ---

const ShareTabContent = () => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        setCopied(true);
        navigator.clipboard.writeText("https://form-builder-jaimin.netlify.app/invite/aB3xZ9");
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-violet-100 rounded-lg text-violet-600"><Link size={16} /></div>
                    <h3 className="text-sm font-bold text-gray-900">Share with a link</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 flex items-center ring-1 ring-gray-200">
                    <Globe className="h-4 w-4 text-gray-400 mx-2" />
                    <span className="text-xs text-gray-600 flex-1 truncate font-medium">form-builder-jaimin.netlify.app/form/x89...</span>
                    <Button size="sm" onClick={handleCopy} className={`h-7 px-3 text-[10px] font-bold transition-all ${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-900 hover:bg-gray-800'}`}>
                        <AnimatePresence mode="wait">{copied ? <motion.span key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Copied!</motion.span> : <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Copy</motion.span>}</AnimatePresence>
                    </Button>
                </div>
                <div className="flex gap-2 mt-4">
                    {[Twitter, Linkedin, Mail].map((Icon, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-violet-100 hover:text-violet-600 transition-colors cursor-pointer">
                            <Icon size={14} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-sky-100 rounded-lg text-sky-600"><Code size={16} /></div>
                        <h3 className="text-sm font-bold text-gray-900">Embed anywhere</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Add your form directly to your website with a simple copy-paste.</p>
                </div>
                <button className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 text-xs font-medium transition-colors text-gray-700 border border-gray-200">
                    <span>&lt;iframe src="..." /&gt;</span>
                    <Copy size={12} className="text-gray-400" />
                </button>
            </div>
        </div>
    );
};

const ConnectTabContent = () => {
    const integrations = [{ icon: Slack, name: "Slack", desc: "Send notifications to channels" }, { icon: FileText, name: "Google Sheets", desc: "Sync responses in real-time" }];
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Active Integrations</h3>
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">2 Connected</span>
            </div>
            <motion.div className="space-y-3" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                {integrations.map(item => (
                    <motion.div key={item.name} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
                                <item.icon className="h-5 w-5 text-gray-700" />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-gray-900">{item.name}</span>
                                <span className="block text-xs text-gray-500">{item.desc}</span>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

const ResultsTabContent = () => (
    <div className="grid grid-cols-3 gap-4 h-full">
        <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Responses</h4>
                    <span className="text-2xl font-bold text-gray-900">1,204</span>
                </div>
                <div className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full">+12%</div>
            </div>
            <div className="flex-1 flex items-end gap-1.5 px-1">
                {[40, 60, 50, 80, 75, 95, 65, 85, 90, 70].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ stiffness: 200, damping: 15, delay: i * 0.05 }}
                        className="w-full bg-violet-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                    />
                ))}
            </div>
        </div>
        <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
                    <BarChart size={20} />
                </div>
                <span className="text-xl font-bold text-gray-900">85%</span>
                <span className="text-[10px] text-gray-500 font-medium">Completion Rate</span>
            </div>
        </div>
    </div>
);


// --- Main Section Component ---
export const CollaborativeSection = () => {
    const [activeTab, setActiveTab] = useState<"Share" | "Connect" | "Results">("Share");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // 3D Tilt Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
    const rotateX = useTransform(springY, [-0.5, 0.5], ['3deg', '-3deg']);
    const rotateY = useTransform(springX, [-0.5, 0.5], ['-3deg', '3deg']);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { const rect = e.currentTarget.getBoundingClientRect(); const { width, height, left, top } = rect; const mouseXVal = e.clientX - left; const mouseYVal = e.clientY - top; const xPct = mouseXVal / width - 0.5; const yPct = mouseYVal / height - 0.5; mouseX.set(xPct); mouseY.set(yPct); };
    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

    // Animation Variants
    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };
    const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { stiffness: 100, damping: 15 } } };
    const contentVariants = {
        hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } }
    };

    const TABS = ["Share", "Connect", "Results"];

    const renderContent = () => {
        switch (activeTab) {
            case "Share": return <ShareTabContent />;
            case "Connect": return <ConnectTabContent />;
            case "Results": return <ResultsTabContent />;
            default: return null;
        }
    };

    return (
        <section ref={ref} className="bg-white py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute top-0 -left-32 w-96 h-96 bg-violet-100/50 rounded-full opacity-50 blur-3xl -z-10" />
            <div className="absolute bottom-0 -right-32 w-96 h-96 bg-sky-100/50 rounded-full opacity-50 blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    className="grid lg:grid-cols-2 gap-x-16 gap-y-16 items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    <motion.div variants={itemVariants}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-6">
                            <Users size={16} /><span>Built for Teams</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">Create, share, and analyze together.</h2>
                        <p className="mt-6 text-lg leading-relaxed text-gray-600">Work seamlessly with tools designed for teamwork. Share ideas, co-edit in real-time, and build powerful surveys, registrations, or quizzes—even when you're miles apart.</p>
                        <div className="mt-10">
                            <Button size="lg" className="group bg-gray-900 text-white hover:bg-gray-800 text-base px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                Explore Collaboration<ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="perspective-1000">
                        <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/60 p-2 min-h-[400px] flex flex-col">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/30 to-sky-50/30 rounded-2xl -z-10" />

                            <div className="relative flex p-1 bg-gray-100/50 rounded-xl mb-2">
                                {TABS.map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab as any)} className={`relative z-10 flex-1 px-4 py-2.5 text-sm font-bold transition-colors duration-200 rounded-lg ${activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div className="absolute inset-0 bg-white rounded-lg shadow-sm border border-gray-200/50 -z-10" layoutId="activeTab" transition={{ stiffness: 300, damping: 30 }} />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 p-6 bg-gray-50/50 rounded-xl border border-gray-100/50 overflow-hidden relative">
                                <AnimatePresence mode="wait">
                                    <motion.div key={activeTab} variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="w-full h-full">
                                        {renderContent()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};