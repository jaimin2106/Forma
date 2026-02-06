import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Users, Mail } from "lucide-react";

const Marketing = () => {
    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">

                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="text-violet-600 font-semibold tracking-wide uppercase text-sm">Solutions for Marketing Teams</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">
                            Capture Leads. <br /> Understand Your Audience.
                        </h1>
                        <p className="text-xl text-slate-600 mb-8">
                            Create high-converting campaigns, customer surveys, and lead generation forms that integrate directly with your CRM.
                        </p>
                        <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full h-12 px-8">
                            Start Campaign
                        </Button>
                    </motion.div>
                </div>

                {/* Use Cases */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <div className="space-y-8">
                        {[
                            { icon: Target, title: "Lead Generation", desc: "Qualify leads instantly with conditional logic and scoring." },
                            { icon: TrendingUp, title: "Market Research", desc: "Gather deep insights into customer preferences and trends." },
                            { icon: Users, title: "Event Registration", desc: "Seamless sign-ups for webinars, conferences, and launch parties." },
                            { icon: Mail, title: "NPS & Feedback", desc: "Automate satisfaction surveys to measure brand loyalty." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4"
                            >
                                <div className="mt-1 w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-slate-500 mt-1">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-slate-100 rounded-2xl p-8 aspect-square flex items-center justify-center relative overflow-hidden"
                    >
                        {/* Abstract graphic representing marketing dashboard */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-blue-500/10" />
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div className="h-4 w-24 bg-slate-200 rounded" />
                                <div className="h-4 w-8 bg-green-100 text-green-600 text-xs flex items-center justify-center rounded">24%</div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-slate-100 rounded overflow-hidden">
                                    <div className="h-full bg-violet-500 w-[70%]" />
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[45%]" />
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded overflow-hidden">
                                    <div className="h-full bg-pink-500 w-[60%]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Marketing;
