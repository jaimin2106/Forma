import { Button } from "@/components/ui/button";
import { Shield, Globe, Users, Zap, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";

const Enterprise = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 -z-10" />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-slate-900 mb-6"
                    >
                        Scale with Confidence
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 max-w-2xl mx-auto mb-10"
                    >
                        Forma Enterprise delivers the security, control, and dedicated support large organizations need to move fast.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center gap-4"
                    >
                        <Button size="lg" className="h-12 px-8 bg-violet-600 hover:bg-violet-700 text-white rounded-full">
                            Contact Sales
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 rounded-full">
                            View Deployment Options
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Feature Grid */}
            <div className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                        {
                            icon: Shield,
                            title: "Enterprise-Grade Security",
                            desc: "SSO, Audit Logs, Role-Based Access Control (RBAC), and HIPAA compliance ready."
                        },
                        {
                            icon: Globe,
                            title: "Data Residency",
                            desc: "Choose where your data lives. US, EU, and Asia-Pacific hosting regions available."
                        },
                        {
                            icon: Users,
                            title: "Dedicated Support",
                            desc: "White-glove onboarding, dedicated success manager, and 24/7 priority support."
                        },
                        {
                            icon: Zap,
                            title: "Custom Limits",
                            desc: "Unlimited API usage, higher rate limits, and custom storage solutions."
                        },
                        {
                            icon: CheckCircle2,
                            title: "SLA Guarantee",
                            desc: "99.99% uptime SLA with financial backing for peace of mind."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-violet-100 hover:shadow-lg transition-all"
                        >
                            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-lg flex items-center justify-center mb-6">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Enterprise;
