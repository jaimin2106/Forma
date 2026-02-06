import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Lightbulb, Bug, Search, Rocket } from "lucide-react";

const Product = () => {
    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">

                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-pink-600 font-semibold tracking-wide uppercase text-sm">Solutions for Product Teams</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
                            Build What Users Actually Want.
                        </h1>
                        <p className="text-xl text-slate-600 mb-8">
                            Validate ideas, collect feature requests, and track bugs effortlessly. Put user feedback at the center of your roadmap.
                        </p>
                        <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full h-12 px-8">
                            Validate Idea
                        </Button>
                    </motion.div>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {[
                        { icon: Lightbulb, title: "Feature Requests", desc: "Crowdsource and prioritize features directly from users." },
                        { icon: Bug, title: "Bug Reporting", desc: "Detailed bug reports with screenshots and environment data." },
                        { icon: Search, title: "User Research", desc: "Screen participants for interviews and usability tests." },
                        { icon: Rocket, title: "Beta Feedback", desc: "Collect structured feedback during beta launches." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-pink-200 transition-all text-center"
                        >
                            <div className="w-12 h-12 mx-auto bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mb-4">
                                <item.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Product;
