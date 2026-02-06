"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { FiBarChart2, FiSliders, FiEdit3, FiArrowRight } from 'react-icons/fi';
import { FormBuilderSVG, DashboardSVG, CustomizerSVG } from './HeroSectionSVGs';

// --- Data & Types ---
// --- Data & Types ---
const slidesData = [
    {
        id: 1,
        icon: <FiBarChart2 className="w-6 h-6" />,
        title: "AI-Powered Decision Intelligence.",
        description: "Transform raw data into strategic actions with our advanced AI decision making tool. Gain clarity and direction instantly.",
        accentColor: "#6366f1", // Indigo
        component: DashboardSVG
    },
    {
        id: 2,
        icon: <FiEdit3 className="w-6 h-6" />,
        title: "Smart Decision Support Forms.",
        description: "Build robust data collection interfaces that feed our AI reasoning software. The ultimate business decision intelligence tool.",
        accentColor: "#3b82f6", // Blue
        component: FormBuilderSVG
    },
    {
        id: 3,
        icon: <FiSliders className="w-6 h-6" />,
        title: "Automated AI Insights Platform.",
        description: "Your personalized AI productivity assistant. Visualize trends, predict outcomes, and optimize performance effortlessly.",
        accentColor: "#ec4899", // Pink
        component: CustomizerSVG
    },
];

const SLIDE_DURATION = 6000;

// --- Laptop Mockup Component ---
const LaptopMockup = ({ children }: { children: React.ReactNode }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

    // Subtle 3D tilt effect on mouse move
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

    // Parallax effect
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
                {/* Laptop Body Shadow */}
                <div className="absolute inset-0 translate-y-4 scale-[0.98] bg-black/20 blur-2xl rounded-[2rem] -z-10" />

                {/* Laptop Body */}
                <div className="absolute inset-0 bg-[#0f172a] rounded-[1.5rem] shadow-2xl ring-1 ring-white/10 overflow-hidden">

                    {/* Screen Bezel */}
                    <div className="absolute inset-[3px] bg-black rounded-[1.2rem] overflow-hidden">
                        {/* Camera Notch Area */}
                        <div className="absolute top-0 w-full h-8 z-20 flex justify-center">
                            <div className="w-32 h-5 bg-[#0f172a] rounded-b-xl flex items-center justify-center gap-2">
                                <div className="w-1.5 h-1.5 bg-[#1e293b] rounded-full ring-1 ring-white/5" />
                                <div className="w-1 h-1 bg-green-500/50 rounded-full" />
                            </div>
                        </div>

                        {/* Screen Content */}
                        <div className="w-full h-full bg-slate-50 relative overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Hinge/Base Reflection */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-white/20 blur-sm rounded-full" />
            </motion.div>
        </motion.div>
    );
};

// --- Main Hero Section Component ---
export const HeroSection = ({ user }: { user: any }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const activeSlide = slidesData[currentSlide];
    const ActiveComponent = activeSlide.component;

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slidesData.length), SLIDE_DURATION);
        return () => clearInterval(timer);
    }, [currentSlide]);

    return (
        <section ref={containerRef} className="relative bg-white min-h-[100vh] pt-32 pb-20 flex flex-col justify-center overflow-hidden">
            {/* Vibrant Background Elements */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100 blur-3xl opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-60" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-100 blur-3xl opacity-40 animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-2 gap-y-16 gap-x-12 items-center">

                    {/* Left: Text Content */}
                    <motion.div style={{ y, opacity }} className="text-center lg:text-left flex flex-col items-center lg:items-start">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="w-full"
                            >
                                {/* Badge */}
                                <motion.div
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-8 bg-white/50 backdrop-blur-sm self-start mx-auto lg:mx-0"
                                    style={{ borderColor: `${activeSlide.accentColor}30` }}
                                >
                                    <span className="flex items-center justify-center p-1 rounded-full" style={{ backgroundColor: `${activeSlide.accentColor}20`, color: activeSlide.accentColor }}>
                                        {activeSlide.icon}
                                    </span>
                                    <span className="text-sm font-semibold tracking-wide uppercase text-slate-800">
                                        {activeSlide.title.split(" ")[0]}
                                        <span className="text-slate-500 font-medium normal-case tracking-normal ml-1">Feature</span>
                                    </span>
                                </motion.div>

                                {/* Headline */}
                                <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
                                    {activeSlide.title.split(" ").map((word, i) => (
                                        <span key={i} className="inline-block mr-3">
                                            {word}
                                        </span>
                                    ))}
                                </h1>

                                {/* Description */}
                                <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                                    {activeSlide.description}
                                </p>

                                {/* CTAs */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Link to={user ? "/dashboard" : "/auth"}>
                                        <Button size="lg" className="h-14 px-8 rounded-full text-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                            {user ? "Go to Dashboard" : "Start for Free"}
                                            <FiArrowRight className="ml-2" />
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="lg" className="h-14 px-8 rounded-full text-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                                        View Live Demo
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Slide Indicators (Desktop aligned left) */}
                        <div className="hidden lg:flex mt-12 gap-3">
                            {slidesData.map((slide, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-12' : 'w-4 bg-slate-200 hover:bg-slate-300'}`}
                                    style={{ backgroundColor: currentSlide === index ? slide.accentColor : undefined }}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Laptop Mockup */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-slate-50/50 rounded-full blur-3xl -z-10 transform scale-90 group-hover:scale-100 transition-transform duration-700" />

                        <LaptopMockup>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-full h-full p-1"
                                >
                                    <ActiveComponent />
                                </motion.div>
                            </AnimatePresence>
                        </LaptopMockup>

                        {/* Mobile Indicators */}
                        <div className="flex lg:hidden justify-center mt-8 gap-3">
                            {slidesData.map((slide, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8' : 'w-2 bg-slate-200'}`}
                                    style={{ backgroundColor: currentSlide === index ? slide.accentColor : undefined }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};