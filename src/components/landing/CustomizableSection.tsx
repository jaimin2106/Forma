import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Palette, Grab, Check } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

// --- Feature List Item Component ---
const FeatureListItem = ({ icon: Icon, title, children }: any) => (
    <div className="flex items-start gap-5 group">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
            <Icon className="w-6 h-6 text-violet-600" />
        </div>
        <div>
            <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
            <p className="text-gray-600 text-sm mt-1 leading-relaxed">{children}</p>
        </div>
    </div>
);

// --- Animated Form Builder Visual ---
const AnimatedFormBuilder = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.4 });

    // 3D Tilt Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
    const rotateX = useTransform(springY, [-0.5, 0.5], ['6deg', '-6deg']);
    const rotateY = useTransform(springX, [-0.5, 0.5], ['-6deg', '6deg']);
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { const rect = e.currentTarget.getBoundingClientRect(); const { width, height, left, top } = rect; const mouseXVal = e.clientX - left; const mouseYVal = e.clientY - top; const xPct = mouseXVal / width - 0.5; const yPct = mouseYVal / height - 0.5; mouseX.set(xPct); mouseY.set(yPct); };
    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

    const formElements = [
        { id: 'name', type: 'Input', label: 'What is your name?', placeholder: 'Type your answer here...' },
        { id: 'email', type: 'Input', label: 'What is your email?', placeholder: 'name@example.com' },
        { id: 'rating', type: 'Rating', label: 'How would you rate us?', stars: 5 },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -50, y: 20 },
        visible: { opacity: 1, x: 0, y: 0, transition: { stiffness: 100 } }
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full h-[500px] bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-6 flex gap-6 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-sky-50/50 -z-10" />

            {/* Palette Sidebar */}
            <div className="w-20 bg-white/50 backdrop-blur-sm rounded-2xl p-3 flex flex-col gap-4 border border-white/60 shadow-inner">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : {}}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="w-full aspect-square bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    >
                        <div className="w-6 h-6 rounded-md bg-gray-100" />
                    </motion.div>
                ))}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="space-y-6"
                >
                    <div className="h-8 w-1/3 bg-gray-100 rounded-lg mb-8" />
                    {formElements.map(el => (
                        <motion.div key={el.id} variants={itemVariants} className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-400 hover:shadow-md transition-all duration-300">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center shadow-lg">
                                    <Grab className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-900 font-semibold mb-3">{el.label}</p>
                            {el.type === 'Rating' ? (
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => <div key={i} className="w-6 h-6 rounded-full bg-gray-100" />)}
                                </div>
                            ) : (
                                <div className="w-full h-10 bg-gray-50 rounded-lg border border-gray-100" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};


// --- Main Section Component ---
export const CustomizableSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
    };

    return (
        <section ref={ref} className="bg-white py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute top-1/2 -left-32 w-96 h-96 bg-violet-100/50 rounded-full opacity-50 blur-3xl -z-10" />
            <div className="absolute top-1/3 -right-32 w-96 h-96 bg-sky-100/50 rounded-full opacity-50 blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: Text Content */}
                    <motion.div
                        variants={textVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                    >
                        <motion.div variants={textVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-6">
                            <Palette className="w-4 h-4" />
                            <span>Total Customization</span>
                        </motion.div>

                        <motion.h2 variants={textVariants} className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                            Build forms exactly the way you want them.
                        </motion.h2>
                        <motion.p variants={textVariants} className="mt-6 text-lg text-gray-600 leading-relaxed">
                            You don't have to sacrifice form for function. Create flexible forms tailored to your needs (and your brand) without writing a single line of code.
                        </motion.p>

                        <motion.div variants={textVariants} className="mt-10 space-y-8">
                            <FeatureListItem icon={Grab} title="Drag & Drop Builder">
                                Our intuitive interface makes form creation as simple as moving blocks around. No technical skills required.
                            </FeatureListItem>
                            <FeatureListItem icon={Bot} title="AI Assistance">
                                Let our AI generate questions, suggest logic, and even analyze your results for you.
                            </FeatureListItem>
                            <FeatureListItem icon={Palette} title="Brand Matching">
                                Customize colors, fonts, and layouts to create a seamless experience for your users.
                            </FeatureListItem>
                        </motion.div>

                        <motion.div variants={textVariants} className="mt-12">
                            <Button size="lg" className="group bg-gray-900 text-white hover:bg-gray-800 text-base px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                                Explore Customization
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT: Visual */}
                    <div className="relative min-h-[500px] flex items-center justify-center perspective-1000">
                        <AnimatedFormBuilder />
                    </div>

                </div>
            </div>
        </section>
    );
};