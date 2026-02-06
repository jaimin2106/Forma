"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Data
const testimonials = [
  {
    logo: "https://ui-avatars.com/api/?name=Pitch&background=random",
    quote: "Forma has completely transformed how we gather feedback. The AI insights are game-changing.",
    author: "Sarah J.",
    title: "Product Manager",
    company: "Pitch",
    avatar: "https://ui-avatars.com/api/?name=Sarah+J&background=random"
  },
  {
    logo: "https://ui-avatars.com/api/?name=Clearbit&background=random",
    quote: "The most intuitive form builder we've ever used. Our response rates increased by 40%.",
    author: "Mark T.",
    title: "Growth Lead",
    company: "Clearbit",
    avatar: "https://ui-avatars.com/api/?name=Mark+T&background=random"
  },
  {
    logo: "https://ui-avatars.com/api/?name=Segment&background=random",
    quote: "Finally, a form tool that doesn't just collect data but actually helps us understand it.",
    author: "Elena R.",
    title: "Director of Marketing",
    company: "Segment",
    avatar: "https://ui-avatars.com/api/?name=Elena+R&background=random"
  }
];

// Utility
const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
};

// Variants
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "6%" : "-6%",
    opacity: 0,
    filter: "blur(4px)",
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir < 0 ? "6%" : "-6%",
    opacity: 0,
    filter: "blur(4px)",
    scale: 0.98,
  }),
};

export const TestimonialSection = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const current = testimonials[index];

  useEffect(() => {
    if (isPaused || reduced) return;
    const t = setTimeout(() => paginate(1), 6500);
    return () => clearTimeout(t);
  }, [index, isPaused, reduced]);

  const paginate = (dir: number) => {
    setDirection(dir);
    setIndex((p) => (p + dir + testimonials.length) % testimonials.length);
  };

  return (
    <section
      className="bg-[#F7F9FC] py-24 sm:py-32 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Testimonials"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-6">
            <Star size={16} className="fill-violet-600" /><span>Trusted by Leaders</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
            Loved by product teams everywhere.
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Decorative Quotes */}
          <Quote className="absolute -top-12 -left-8 text-violet-200 w-24 h-24 opacity-50 rotate-180" />

          <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />

            <div className="flex flex-col items-center text-center">
              <div className="h-12 mb-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.company}
                    src={current.logo}
                    alt={`${current.company} logo`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.6, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </AnimatePresence>
              </div>

              <div className="relative h-40 md:h-32 w-full overflow-hidden mb-10 flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.blockquote
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ stiffness: 200, damping: 24, mass: 0.8 }}
                    className="absolute w-full text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed px-4 md:px-12"
                    aria-live={isPaused ? "polite" : "off"}
                  >
                    “{current.quote}”
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-violet-100 animate-ping opacity-20" />
                  <img
                    src={current.avatar}
                    alt={current.author}
                    className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white"
                  />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 text-lg">{current.author}</p>
                  <p className="text-gray-500 text-sm font-medium">
                    {current.title}, {current.company}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Absolute positioned on desktop */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-16 hidden xl:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="rounded-full w-12 h-12 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm"
            >
              <ArrowLeft size={20} />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-16 hidden xl:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="rounded-full w-12 h-12 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm"
            >
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation & Indicators */}
        <div className="flex flex-col items-center gap-6 mt-12">
          <div className="flex xl:hidden gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="rounded-full w-12 h-12 border-gray-200 bg-white hover:bg-gray-50"
            >
              <ArrowLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="rounded-full w-12 h-12 border-gray-200 bg-white hover:bg-gray-50"
            >
              <ArrowRight size={20} />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3" role="tablist" aria-label="Testimonial pages">
            {testimonials.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={index === i}
                aria-current={index === i ? "true" : undefined}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${index === i ? "w-8 bg-violet-600" : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
