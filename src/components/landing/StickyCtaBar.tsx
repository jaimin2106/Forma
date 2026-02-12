"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiX } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";

// Scroll threshold to show the sticky CTA bar (in pixels)
const SCROLL_THRESHOLD = 600;

export const StickyCtaBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            if (isDismissed) return;

            const scrollPosition = window.scrollY;
            setIsVisible(scrollPosition > SCROLL_THRESHOLD);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isDismissed]);

    const handleDismiss = () => {
        setIsDismissed(true);
        setIsVisible(false);
    };

    // Don't render for authenticated users (they see dashboard link instead)
    if (user) return null;

    return (
        <AnimatePresence>
            {isVisible && !isDismissed && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl"
                >
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                        {/* Message */}
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">
                                Ready to build smarter forms?
                            </p>
                            <p className="text-xs text-gray-500">
                                Start your free trial today — no credit card required.
                            </p>
                        </div>

                        {/* Mobile Message */}
                        <p className="sm:hidden text-sm font-medium text-gray-900">
                            Start your free trial
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Link to="/auth">
                                <Button
                                    className="h-10 px-6 rounded-full text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all duration-300"
                                >
                                    Start Free Trial
                                    <FiArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>

                            {/* Dismiss Button */}
                            <button
                                onClick={handleDismiss}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Dismiss"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
