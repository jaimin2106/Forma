"use client";

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { CheckCircle, Sparkles } from 'lucide-react';
import { DashboardSVG } from './HeroSectionSVGs';

// --- Laptop Mockup Component ---
const LaptopMockup = ({ children }: { children: React.ReactNode }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

    const rotateX = useTransform(springY, [-0.5, 0.5], ['2deg', '-2deg']);
    const rotateY = useTransform(springX, [-0.5, 0.5], ['-2deg', '2deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const { width, height, left, top } = rect;
        const mouseXVal = e.clientX - left;
        const mouseYVal = e.clientY - top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

    return (
        <motion.div style={{ y }} className="relative z-10 w-full flex justify-center perspective-1000">
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="w-full max-w-[800px] aspect-[16/10] relative transition-transform duration-200 ease-out"
            >
                <div className="absolute inset-0 translate-y-4 scale-[0.98] bg-black/20 blur-2xl rounded-[2rem] -z-10" />
                <div className="absolute inset-0 bg-[#0f172a] rounded-[1.5rem] shadow-2xl ring-1 ring-white/10 overflow-hidden">
                    <div className="absolute inset-[3px] bg-black rounded-[1.2rem] overflow-hidden">
                        <div className="absolute top-0 w-full h-8 z-20 flex justify-center">
                            <div className="w-32 h-5 bg-[#0f172a] rounded-b-xl flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#1e293b] rounded-full ring-1 ring-white/5" />
                                <div className="w-1 h-1 bg-green-500/50 rounded-full" />
                            </div>
                        </div>
                        <div className="w-full h-full bg-slate-50 relative overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-white/20 blur-sm rounded-full" />
            </motion.div>
        </motion.div>
    );
};

// --- Main Hero Section Component (STATIC - No Carousel) ---
interface HeroSectionProps {
    user: { id: string; email?: string } | null;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    return (
        <section ref={containerRef} className="relative bg-white min-h-[85vh] pt-28 pb-16 flex flex-col justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-100 blur-3xl opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-60" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-100 blur-3xl opacity-40" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-y-12 gap-x-12 items-center">

                    {/* Left: Text Content (STATIC) */}
                    <motion.div style={{ y, opacity }} className="text-center lg:text-left flex flex-col items-center lg:items-start">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-200 mb-6 bg-violet-50/50 backdrop-blur-sm"
                        >
                            <span className="flex items-center justify-center p-1.5 rounded-full bg-violet-100 text-violet-600">
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <span className="text-sm font-semibold text-violet-700">
                                AI-Powered Form Builder
                            </span>
                        </motion.div>

                        {/* Static Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl sm:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6"
                        >
                            Build Forms That{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                                Think For You
                            </span>
                        </motion.h1>

                        {/* Static Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-xl text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
                        >
                            Create intelligent forms in minutes. Collect responses, analyze with AI,
                            and make smarter decisions—all in one powerful platform.
                        </motion.p>

                        {/* CTAs with Proper Hierarchy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            {/* Primary CTA */}
                            <Link to={user ? "/dashboard" : "/auth"}>
                                <Button
                                    size="lg"
                                    className="h-12 px-8 rounded-full text-base font-semibold bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    {user ? "Go to Dashboard" : "Start Free Trial"}
                                    <FiArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            {/* Secondary CTA */}
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-12 px-8 rounded-full text-base font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
                            >
                                <FiPlay className="mr-2 h-4 w-4" />
                                Watch Demo
                            </Button>
                        </motion.div>

                        {/* Trust Reinforcement */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mt-6 text-sm text-slate-500"
                        >
                            <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                14-day free trial
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Cancel anytime
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Right: Laptop Mockup (STATIC - Single Product View) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-200/50 to-slate-50/50 rounded-full blur-3xl -z-10 transform scale-90 group-hover:scale-100 transition-transform duration-700" />

                        <LaptopMockup>
                            <div className="w-full h-full p-1">
                                <DashboardSVG />
                            </div>
                        </LaptopMockup>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};