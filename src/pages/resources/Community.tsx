import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Heart } from "lucide-react";

const Community = () => {
    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Join the Conversation</h1>
                    <p className="text-xl text-slate-600 mb-8">
                        Connect with thousands of creators, developers, and data pros building with Forma.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                            Join Discord
                        </Button>
                        <Button size="lg" variant="outline">
                            Visit Forum
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Users, title: "10,000+ Members", desc: "A growing network of professionals helping each other." },
                        { icon: MessageSquare, title: "Live Q&A", desc: "Weekly sessions with the product team and experts." },
                        { icon: Heart, title: "Showcase", desc: "Share your work and get inspired by what others are building." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="text-center p-8 bg-slate-50 rounded-2xl"
                        >
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 text-slate-900">
                                <item.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-500">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Community;
