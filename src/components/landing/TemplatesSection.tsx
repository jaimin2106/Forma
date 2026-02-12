import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, UserPlus, Zap, LayoutGrid } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// --- High-Fidelity Mockup Components ---
const RegistrationMockup = () => (
    <div className="bg-amber-50 p-6 rounded-t-xl h-full flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-100/50 to-transparent" />
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <UserPlus className="w-7 h-7 text-amber-500" />
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-amber-100 p-3 space-y-2 max-w-[180px] transform group-hover:translate-y-[-5px] transition-transform duration-300">
            <div className="w-full h-2 bg-slate-100 rounded-full" />
            <div className="w-2/3 h-2 bg-slate-100 rounded-full" />
            <div className="w-full h-7 bg-amber-500/10 rounded-lg mt-2" />
        </div>
    </div>
);

const LeadGenMockup = () => (
    <div className="bg-violet-50 p-6 rounded-t-xl h-full flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-100/50 to-transparent" />
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-7 h-7 text-violet-500" />
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-violet-100 p-3 space-y-2 max-w-[180px] transform group-hover:translate-y-[-5px] transition-transform duration-300">
            <div className="w-full h-7 border border-violet-100 rounded-lg bg-violet-50/30" />
            <div className="w-full h-7 bg-violet-500 rounded-lg shadow-sm shadow-violet-200" />
        </div>
    </div>
);

const FeedbackMockup = () => (
    <div className="bg-pink-50 p-6 rounded-t-xl h-full flex flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-100/50 to-transparent" />
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Star className="w-7 h-7 text-pink-500" />
        </div>
        <div className="flex gap-1 transform group-hover:scale-105 transition-transform duration-300">
            {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${i < 4 ? 'bg-pink-400 text-white' : 'bg-white text-pink-200'}`}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                </div>
            ))}
        </div>
    </div>
);

// --- Data for Template Cards ---
const templatesData = [
    { id: "registration", title: "Online Registration Form", description: "Get more sign-ups with this easy-to-use and customizable template.", mockup: <RegistrationMockup /> },
    { id: "lead-gen", title: "Lead Generation Form", description: "Capture prospects and convert them with this out-of-the-box solution.", mockup: <LeadGenMockup /> },
    { id: "feedback", title: "Customer Feedback Form", description: "Unlock insights and improve customer experience with this template.", mockup: <FeedbackMockup /> },
];

// --- Template Card Component (FULLY CLICKABLE) ---
interface TemplateCardProps {
    id: string;
    title: string;
    description: string;
    mockup: React.ReactNode;
    onClick: () => void;
}

const TemplateCard = ({
    title,
    description,
    mockup,
    onClick
}: TemplateCardProps) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -8 }}
            onClick={onClick}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-violet-200 transition-all duration-300 cursor-pointer"
        >
            <div className="h-52 bg-gray-50">{mockup}</div>
            <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight group-hover:text-violet-600 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
                <Button
                    size="sm"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium"
                >
                    Use Template
                    <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
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

    const handleTemplateClick = (templateId: string) => {
        if (user) {
            navigate(`/templates?selected=${templateId}`);
        } else {
            navigate('/auth');
        }
    };

    const handleBrowseAll = () => {
        if (user) {
            navigate('/templates');
        } else {
            navigate('/auth');
        }
    };

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } }
    };

    return (
        <section ref={ref} className="bg-white py-20 sm:py-24 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header with CTA ABOVE cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-4">
                            <LayoutGrid size={16} />
                            <span>1,500+ Templates</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                            Start building in seconds
                        </h2>
                        <p className="mt-3 text-lg text-gray-600 max-w-2xl leading-relaxed">
                            Get inspired by professional templates designed for any purpose.
                        </p>
                    </div>

                    {/* CTA positioned above/beside cards */}
                    <Button
                        size="lg"
                        onClick={handleBrowseAll}
                        variant="outline"
                        className="group border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-base px-6 py-5 rounded-full font-semibold transition-all duration-300 flex-shrink-0"
                    >
                        Browse all templates
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </motion.div>

                {/* Template Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {templatesData.map((template) => (
                        <TemplateCard
                            key={template.id}
                            {...template}
                            onClick={() => handleTemplateClick(template.id)}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};