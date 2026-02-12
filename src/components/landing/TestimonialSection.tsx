"use client";

import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { motion, useInView } from "framer-motion";

// Testimonial Data - 3 visible simultaneously
const testimonials = [
  {
    quote: "Forma has completely transformed how we gather feedback. The AI insights are game-changing.",
    author: "Sarah Johnson",
    title: "Product Manager",
    company: "Pitch",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff",
    rating: 5
  },
  {
    quote: "The most intuitive form builder we've ever used. Our response rates increased by 40%.",
    author: "Mark Thompson",
    title: "Growth Lead",
    company: "Clearbit",
    avatar: "https://ui-avatars.com/api/?name=Mark+Thompson&background=10b981&color=fff",
    rating: 5
  },
  {
    quote: "Finally, a form tool that doesn't just collect data but actually helps us understand it.",
    author: "Elena Rodriguez",
    title: "Director of Marketing",
    company: "Segment",
    avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=f59e0b&color=fff",
    rating: 5
  }
];

// Single Testimonial Card Component
const TestimonialCard = ({
  testimonial,
  index
}: {
  testimonial: typeof testimonials[0];
  index: number
}) => {
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
      {/* Star Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 fill-amber-400 text-amber-400"
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 mb-6 leading-relaxed text-base">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.author}
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            {testimonial.author}
          </p>
          <p className="text-gray-500 text-xs">
            {testimonial.title}, {testimonial.company}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Main Section Component - GRID LAYOUT (No Carousel)
export const TestimonialSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <section
      ref={ref}
      className="bg-slate-50 py-20 sm:py-24 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-4">
            <Star size={16} className="fill-violet-600" />
            <span>Trusted by Leaders</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
            Loved by product teams everywhere
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            See why thousands of teams choose Forma for their form and data collection needs.
          </p>
        </motion.div>

        {/* Decorative Quote */}
        <div className="relative max-w-5xl mx-auto">
          <Quote className="absolute -top-8 -left-4 text-violet-200 w-16 h-16 opacity-40 rotate-180 hidden md:block" />
        </div>

        {/* Testimonials Grid - 3 Cards Visible */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
