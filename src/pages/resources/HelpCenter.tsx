import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { Search, Book, MessageCircle, FileText } from "lucide-react";

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-24">
            <div className="bg-slate-900 text-white py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-6">How can we help?</h1>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Book, title: "Getting Started", desc: "Setting up your account and creating your first form." },
                        { icon: FileText, title: "Account & Billing", desc: "Managing your subscription and team settings." },
                        { icon: MessageCircle, title: "Troubleshooting", desc: "Common issues and how to resolve them." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-4">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-500 mb-4">{item.desc}</p>
                            <a href="#" className="font-semibold text-violet-600 hover:underline">View Articles &rarr;</a>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HelpCenter;
