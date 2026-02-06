import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, UserPlus, Zap } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// --- High-Fidelity Mockup Components ---
const RegistrationMockup = () => (
    <div className="bg-amber-50 p-6 rounded-t-xl h-full flex flex-col justify-center items-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-100/50 to-transparent" />
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <UserPlus className="w-8 h-8 text-amber-500" />
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-amber-100 p-4 space-y-3 max-w-[200px] transform group-hover:translate-y-[-5px] transition-transform duration-300">
            <div className="w-full h-2 bg-slate-100 rounded-full" />
            <div className="w-2/3 h-2 bg-slate-100 rounded-full" />
            <div className="w-full h-8 bg-amber-500/10 rounded-lg mt-2" />
        </div>
    </div>
);

const LeadGenMockup = () => (
    <div className="bg-violet-50 p-6 rounded-t-xl h-full flex flex-col justify-center items-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-100/50 to-transparent" />
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-8 h-8 text-violet-500" />
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-violet-100 p-4 space-y-3 max-w-[200px] transform group-hover:translate-y-[-5px] transition-transform duration-300">
            <div className="w-full h-8 border border-violet-100 rounded-lg bg-violet-50/30" />
            <div className="w-full h-8 bg-violet-500 rounded-lg shadow-sm shadow-violet-200" />
        </div>
    </div>
);

const FeedbackMockup = () => (
    <div className="bg-pink-50 p-6 rounded-t-xl h-full flex flex-col justify-center items-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-100/50 to-transparent" />
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Star className="w-8 h-8 text-pink-500" />
        </div>
        <div className="flex gap-1.5 transform group-hover:scale-105 transition-transform duration-300">
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${i < 4 ? 'bg-pink-400 text-white' : 'bg-white text-pink-200'}`}>
                    <Star className="w-4 h-4 fill-current" />
                </div>
            ))}
        </div>
    </div>
);

// --- Data for Template Cards ---
const templatesData = [
    { title: "Online Registration Form", description: "Get more sign-ups with this easy-to-use and completely customizable template.", mockup: <RegistrationMockup /> },
    { title: "Lead Generation Form", description: "Capture prospects and convert them with this out-of-the-box solution.", mockup: <LeadGenMockup /> },
    { title: "Customer Feedback Form", description: "Unlock insights and improve the customer experience with this simple template.", mockup: <FeedbackMockup /> },
];

// --- Template Card Component ---
const TemplateCard = ({ title, description, mockup }: typeof templatesData[0]) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { stiffness: 100, damping: 15 } }
    };
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
        >
            <div className="h-64 bg-gray-50">{mockup}</div>
            <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{description}</p>
                <span className="font-semibold text-sm text-violet-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Use Template <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </motion.div>
    );
};


// --- Main Section Component ---
export const TemplatesSection = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const handleBrowseAll = () => {
        if (user) {
            navigate('/templates');
        } else {
            navigate('/auth');
        }
    };

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } }
    };

    return (
        <section ref={ref} className="bg-white py-24 sm:py-32 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                        Start building in seconds
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Not sure where to start? Get inspired by our library of 1,500+ templates designed for any purpose, from lead generation to customer feedback.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
                >
                    {templatesData.map((template) => (
                        <TemplateCard key={template.title} {...template} />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-20"
                >
                    <Button
                        size="lg"
                        onClick={handleBrowseAll}
                        className="group bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-base px-8 py-6 rounded-full font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        Browse all templates
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 text-gray-400 group-hover:text-gray-900" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};