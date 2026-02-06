import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Heart, UserPlus, Star, Coffee } from "lucide-react";

const HR = () => {
    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">

                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Solutions for HR & People Ops</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
                            Create a Culture of Feedback.
                        </h1>
                        <p className="text-xl text-slate-600 mb-8">
                            From recruitment to retention, streamline every stage of the employee lifecycle with secure, anonymous forms.
                        </p>
                        <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full h-12 px-8">
                            View Templates
                        </Button>
                    </motion.div>
                </div>

                {/* Use Cases */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {[
                        {
                            icon: UserPlus,
                            title: "Recruitment & Onboarding",
                            desc: "Job application forms, interview scorecards, and new hire checklists."
                        },
                        {
                            icon: Heart,
                            title: "Employee Engagement",
                            desc: "Pulse surveys and eNPS tracking to measure team morale anonymously."
                        },
                        {
                            icon: Star,
                            title: "Performance Reviews",
                            desc: "360-degree feedback collection that is fair, structured, and easy to analyze."
                        },
                        {
                            icon: Coffee,
                            title: "Culture & Perks",
                            desc: "Collect preferences for team events, swag, and office perks."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50/30 hover:border-blue-100 transition-all flex items-start gap-4"
                        >
                            <div className="w-12 h-12 bg-white border border-slate-200 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                <item.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HR;
