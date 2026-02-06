import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { Zap, Layout, BarChart, Lock, Globe, Smartphone } from "lucide-react";

const Features = () => {
    const features = [
        {
            icon: Layout,
            title: "Drag & Drop Builder",
            desc: "Create complex logic flows and multi-page forms without writing a single line of code."
        },
        {
            icon: BarChart,
            title: "Advanced Analytics",
            desc: "Visualize response data in real-time with customizable charts, graphs, and export options."
        },
        {
            icon: Zap,
            title: "Smart Logic",
            desc: "Show or hide questions, skip pages, and calculate scores based on user inputs."
        },
        {
            icon: Lock,
            title: "Secure by Design",
            desc: "End-to-end encryption, GDPR compliance, and spam protection built-in."
        },
        {
            icon: Globe,
            title: "Multi-language Support",
            desc: "Automatically translate your forms to reach a global audience."
        },
        {
            icon: Smartphone,
            title: "Mobile Responsive",
            desc: "Forms look and work perfectly on every device, every time."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Powerful Features for Modern Teams
                    </h1>
                    <p className="text-xl text-slate-600">
                        Everything you need to collect data, automate workflows, and make better decisions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <f.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Features;
