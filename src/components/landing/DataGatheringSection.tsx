import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mail, Star, CreditCard, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";

// --- Sub-Components for Animated Form Mockups ---

const SignupFormMockup = () => (
    <div className="w-full h-full flex overflow-hidden rounded-t-2xl">
        <div className="w-1/2 bg-slate-900 p-6 flex flex-col justify-center group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0" />
            <div className="relative z-10">
                <h3 className="text-white text-xl font-bold mb-2 tracking-tight">Bloomed</h3>
                <p className="text-white/70 text-xs mb-4 font-medium">Take 15% off your next order</p>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 mb-3 backdrop-blur-sm">
                    <p className="text-white/50 text-xs">noah@email.com</p>
                </div>
                <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg shadow-white/10">
                    Subscribe
                </button>
            </div>
        </div>
        <div className="w-1/2 bg-pink-50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-100 to-pink-50" />
            <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full shadow-xl shadow-pink-200/50 transform group-hover:scale-110 transition-transform duration-500" />
        </div>
    </div>
);

const FeedbackFormMockup = () => {
    return (
        <div className="w-full h-full flex group overflow-hidden rounded-t-2xl">
            <div className="w-1/2 bg-violet-600 p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-700 z-0" />
                <div className="relative z-10">
                    <h3 className="text-white text-xl font-bold mb-2 tracking-tight">ROLL</h3>
                    <p className="text-white/80 text-xs mb-4 font-medium">Rate your purchase</p>
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <motion.div
                                key={star}
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ stiffness: 200, damping: 10, delay: star * 0.1 }}
                                viewport={{ once: true, amount: 0.8 }}
                            >
                                <Star className={`h-5 w-5 transition-all duration-300 ${star <= 4 ? 'text-yellow-300 fill-yellow-300 drop-shadow-sm' : 'text-white/30 group-hover:text-yellow-300 group-hover:fill-yellow-300'}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-1/2 bg-sky-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-100 to-sky-50" />
                <div className="w-20 h-20 bg-gradient-to-br from-sky-300 to-blue-400 rounded-full shadow-xl shadow-sky-200/50 transform group-hover:rotate-12 transition-transform duration-500" />
            </div>
        </div>
    );
};

const OrderFormMockup = () => (
    <div className="w-full h-full flex group overflow-hidden rounded-t-2xl">
        <div className="w-1/2 bg-white p-6 flex flex-col justify-center border-r border-gray-100">
            <h3 className="text-gray-900 text-xl font-bold mb-2 tracking-tight">ROAST & GRIND</h3>
            <p className="text-gray-500 text-xs mb-4 font-medium">Order total: $30</p>
            <div className="space-y-2">
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-400 group-hover:border-emerald-500 group-hover:text-emerald-600 transition-colors bg-gray-50">Name</div>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-400 group-hover:border-emerald-500 group-hover:text-emerald-600 transition-colors delay-75 bg-gray-50">Card Number</div>
            </div>
        </div>
        <div className="w-1/2 bg-amber-50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-100 to-amber-50" />
            <div className="w-20 h-20 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full shadow-xl shadow-amber-200/50 transform group-hover:translate-y-[-5px] transition-transform duration-500" />
        </div>
    </div>
);

// --- Main Feature Card Component ---

const FeatureCard = ({ icon: Icon, tag, title, description, formMockup, linkText, accentColor }: any) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { stiffness: 100, damping: 15 } }
    };

    return (
        <motion.div
            variants={itemVariants}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
        >
            <div className={`absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md border shadow-sm rounded-full px-3 py-1.5 flex items-center space-x-2 transition-transform duration-300 group-hover:scale-105`} style={{ borderColor: accentColor + '30' }}>
                <Icon className="h-3.5 w-3.5" style={{ color: accentColor }} />
                <span className="text-xs font-bold tracking-wide uppercase" style={{ color: accentColor }}>{tag}</span>
            </div>

            <div className="h-64 relative bg-gray-50">
                {formMockup}
            </div>

            <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{description}</p>
                <button className="font-semibold text-sm flex items-center transition-all duration-300 group-hover:gap-2" style={{ color: accentColor }}>
                    {linkText}
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300" />
                </button>
            </div>
        </motion.div>
    );
};

// --- Main Section Component ---

export const DataGatheringSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const cardData = [
        { icon: Mail, tag: 'Email', title: 'For signup forms', description: 'Help people subscribe, register, or contact you with question types that collect their personal details—like name and email.', formMockup: <SignupFormMockup />, linkText: 'Browse signup forms', accentColor: '#8b5cf6' },
        { icon: Star, tag: 'Rating', title: 'For feedback forms', description: 'Hear what people think about a purchase or experience with question types that let them rank, rate, and share opinions.', formMockup: <FeedbackFormMockup />, linkText: 'Browse feedback forms', accentColor: '#ec4899' },
        { icon: CreditCard, tag: 'Payment', title: 'For order forms', description: 'Sell your products or services online with question types that let people checkout and make payments securely.', formMockup: <OrderFormMockup />, linkText: 'Browse order forms', accentColor: '#10b981' },
    ];

    return (
        <section ref={ref} className="bg-white py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-50 via-white to-white -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Gather every type of data
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        From contact info to payments, collect what you need with over 28 advanced and intuitive question types.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
                >
                    {cardData.map((card) => (
                        <FeatureCard key={card.tag} {...card} />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-20"
                >
                    <Button size="lg" className="group bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-base px-8 py-6 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300">
                        See all question types
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 text-gray-400 group-hover:text-gray-900" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};