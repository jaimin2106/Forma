"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Twitter,
  Users,
  Palette,
  Type,
  Link as LinkIcon,
  Droplet,
  Check,
  BarChart,
  Share2
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";

// Data
const steps = [
  {
    id: "build",
    title: "Build",
    description:
      "Use templates and 20+ question types to build your form, then customize the look and feel to match your brand.",
    component: "BuildSlide",
  },
  {
    id: "share",
    title: "Share",
    description:
      "Embed your form on your website, share it via email, or post it directly to your social media channels.",
    component: "ShareSlide",
  },
  {
    id: "learn",
    title: "Learn",
    description:
      "Analyze results, track performance, and turn data into actionable insights with our built-in analytics.",
    component: "LearnSlide",
  },
];

// Easing and motion tokens
const springSoft = { stiffness: 180, damping: 24, mass: 0.8 };
const springSnappy = { stiffness: 240, damping: 22, mass: 0.7 };
const easeOut = [0.16, 1, 0.3, 1];

// Utility: prefers-reduced-motion
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

// AnimatedNumber
const AnimatedNumber = ({ value }: { value: number }) => {
  const spring = useSpring(value, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (current) => Math.round(current as number));
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return display.on("change", (latest) => setDisplayValue(latest));
  }, [display]);

  return <motion.span>{displayValue.toLocaleString()}</motion.span>;
};

// BuildSlide: interactive brand palette configurator
const BuildSlide = () => {
  const [hue, setHue] = useState(260);
  const [radius, setRadius] = useState(16);
  const [font, setFont] = useState("Inter");
  const accents = [
    { name: "Primary", h: hue, s: 85, l: 62 },
    { name: "Accent", h: (hue + 40) % 360, s: 75, l: 60 },
    { name: "Soft", h: hue, s: 55, l: 95 },
  ];

  return (
    <div className="w-full h-full rounded-3xl p-8 flex items-center justify-center bg-white border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-transparent -z-10" />
      <motion.div
        className="w-full max-w-2xl grid md:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
        }}
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="rounded-2xl p-5 shadow-sm border border-slate-100 bg-white"
          style={{ fontFamily: font }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-10 w-10 rounded-xl shadow-sm flex items-center justify-center text-white"
              style={{ backgroundColor: `hsl(${hue} 85% 62%)` }}
            >
              <Palette size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Customize</h4>
              <p className="text-xs text-slate-500">Colors • Radius • Fonts</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-2 mb-1">
                <Droplet size={14} /> Hue
              </span>
              <input
                type="range"
                min={0}
                max={359}
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 mb-1 block">Radius</span>
              <input
                type="range"
                min={4}
                max={28}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-2 mb-1">
                <Type size={14} /> Font
              </span>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
              >
                <option>Inter</option>
                <option>Manrope</option>
                <option>Nunito</option>
                <option>DM Sans</option>
              </select>
            </label>
          </div>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="rounded-2xl p-5 bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm flex flex-col justify-between"
          style={{ borderRadius: radius }}
        >
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm">
            Preview
          </h4>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {accents.map((a) => {
              const color = `hsl(${a.h} ${a.s}% ${a.l}%)`;
              return (
                <motion.div
                  key={a.name}
                  whileHover={{ scale: 1.05 }}
                  transition={springSoft}
                  className="p-2 rounded-xl border border-slate-100 shadow-sm bg-white flex flex-col items-center gap-2"
                >
                  <div
                    className="h-8 w-full rounded-lg"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-[10px] font-medium text-slate-500">{a.name}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-3" style={{ fontFamily: font }}>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Question 1</p>
              <div
                className="w-full px-4 py-3 border text-sm bg-white"
                style={{
                  borderRadius: radius,
                  borderColor: `hsl(${hue} 30% 85%)`,
                  boxShadow: `0 2px 5px rgba(0,0,0,0.02)`,
                }}
              >
                What’s your favorite color?
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 text-xs font-medium text-white shadow-md hover:shadow-lg transition-shadow"
                style={{
                  backgroundColor: `hsl(${hue} 85% 62%)`,
                  borderRadius: radius,
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ShareSlide: orbiting icons with hover/tap interactions and glass chips
const ShareSlide = () => {
  const radius = 140;
  const icons = [Mail, Twitter, Users];
  const angles = [-0.7, 0.6, 2.1];

  return (
    <div className="w-full h-full rounded-3xl p-8 flex items-center justify-center relative bg-white border border-gray-100 shadow-sm overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.1),_transparent_70%)] -z-10" />

      <motion.div
        className="relative size-[320px] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springSoft}
      >
        <div className="absolute inset-0 rounded-full border border-dashed border-gray-200 animate-spin-slow" style={{ animationDuration: '20s' }} />

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative px-6 py-3 rounded-2xl text-gray-900 flex items-center justify-center font-bold text-sm shadow-xl border border-white/50 bg-white/80 backdrop-blur-xl z-10"
        >
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600 mr-3">
            <LinkIcon size={16} />
          </div>
          form-builder-jaimin.netlify.app/form/x89
        </motion.div>

        {icons.map((Icon, i) => {
          const x = Math.cos(angles[i]) * radius;
          const y = Math.sin(angles[i]) * radius;
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="absolute rounded-2xl p-4 shadow-lg border border-white/50 bg-white/90 backdrop-blur-xl flex items-center justify-center group"
              style={{ translateX: x, translateY: y }}
            >
              <Icon className="w-6 h-6 text-gray-600 group-hover:text-violet-600 transition-colors" />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

// LearnSlide: counters, completion, bars with subtle shimmer
const LearnSlide = () => {
  const bars = [40, 60, 50, 80, 75, 95, 65, 85];
  return (
    <div className="w-full h-full rounded-3xl p-8 flex flex-col justify-center bg-white border border-gray-100 shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-transparent -z-10" />
      <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
        <div className="p-5 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-violet-100 rounded-md text-violet-600">
              <Users size={14} />
            </div>
            <h4 className="font-bold text-slate-600 text-xs uppercase tracking-wide">Responses</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            <AnimatedNumber value={1204} />
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
            <ArrowRight size={10} className="-rotate-45" /> +12%
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-pink-100 rounded-md text-pink-600">
              <Check size={14} />
            </div>
            <h4 className="font-bold text-slate-600 text-xs uppercase tracking-wide">Completion</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            <AnimatedNumber value={87} />%
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "87%" }}
              transition={springSnappy}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
              }}
            />
          </div>
        </div>

        <div className="col-span-2 p-5 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                <BarChart size={14} />
              </div>
              <h4 className="font-bold text-slate-600 text-xs uppercase tracking-wide">Activity</h4>
            </div>
            <select className="text-xs border-none bg-gray-50 rounded-md px-2 py-1 text-gray-500 font-medium outline-none cursor-pointer hover:bg-gray-100">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-32 flex items-end gap-3 md:gap-6 relative px-2">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ ...springSnappy, delay: i * 0.05 + 0.1 }}
                className="w-full rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer group relative"
                style={{
                  background: "linear-gradient(180deg, #8b5cf6, #a78bfa)",
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {h} responses
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const slideComponents = { BuildSlide, ShareSlide, LearnSlide };

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Auto-advance
  useEffect(() => {
    if (isPaused || reduced) return;
    const timer = setTimeout(() => {
      setDirection(1);
      setActiveStep((p) => (p + 1) % steps.length);
    }, 6500);
    return () => clearTimeout(timer);
  }, [activeStep, isPaused, reduced]);

  const paginate = (newDir: number) => {
    setDirection(newDir);
    setActiveStep((p) => (p + newDir + steps.length) % steps.length);
  };

  const currentStep = steps[activeStep];
  const SlideComponent = slideComponents[currentStep.component as keyof typeof slideComponents];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "8%" : "-8%",
      opacity: 0,
      scale: 0.98,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "8%" : "-8%",
      opacity: 0,
      scale: 0.98,
      filter: "blur(4px)",
    }),
  };

  return (
    <section
      className="bg-white py-24 sm:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="How it works"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* LEFT: Text */}
          <div className="relative min-h-52" aria-live={isPaused ? "polite" : "off"}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={activeStep}
                className="absolute w-full"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={springSoft}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-6">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-200 text-violet-700 text-xs font-bold">{activeStep + 1}</span>
                  <span>Step {activeStep + 1}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
                  {currentStep.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {currentStep.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: Visual */}
          <div className="h-[500px] relative perspective-1000">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeStep}
                className="w-full h-full absolute"
                custom={direction}
                variants={{
                  ...slideVariants,
                  center: {
                    ...slideVariants.center,
                    transition: { ...springSoft, when: "beforeChildren", delay: 0.05, staggerChildren: 0.06 },
                  },
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={springSoft}
                aria-roledescription="slide"
                aria-label={currentStep.title}
              >
                {SlideComponent ? <SlideComponent /> : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-20 border-t border-gray-100 pt-8">
          <div className="flex items-center gap-3" role="tablist" aria-label="Steps">
            {steps.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={activeStep === i}
                aria-current={activeStep === i ? "true" : undefined}
                onClick={() => {
                  setDirection(i > activeStep ? 1 : -1);
                  setActiveStep(i);
                }}
                className={`h-2 rounded-full transition-all duration-500 ${activeStep === i ? "w-12 bg-violet-600" : "w-3 bg-gray-200 hover:bg-gray-300"
                  }`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(-1)}
              aria-label="Previous"
              className="rounded-full w-12 h-12 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              <ArrowLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(1)}
              aria-label="Next"
              className="rounded-full w-12 h-12 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
