import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Link } from "lucide-react";
import { motion, useInView } from "framer-motion";

// --- Data for Integration Icons ---
// For a real app, you'd use actual SVG logos
const integrations = [
    { name: "Slack", color: "bg-[#4A154B]", initial: "S" },
    { name: "Google Drive", color: "bg-[#1DA564]", initial: "G" },
    { name: "Salesforce", color: "bg-[#00A1E0]", initial: "Sf" },
    { name: "Mailchimp", color: "bg-[#FFE01B]", initial: "M", textColor: "text-black" },
    { name: "Zapier", color: "bg-[#FF4A00]", initial: "Z" },
    { name: "Notion", color: "bg-black", initial: "N" },
    { name: "HubSpot", color: "bg-[#FF7A59]", initial: "H" },
    { name: "Trello", color: "bg-[#0079BF]", initial: "T" },
];

const AppIcon = ({ icon, index, radius, total }: { icon: any; index: number; radius: number, total: number }) => {
    const angle = (index / total) * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return (
        <motion.div
            key={icon.name}
            className={`absolute w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg border-2 border-white/50 ${icon.color} ${icon.textColor || ''}`}
            style={{ top: '50%', left: '50%', margin: '-32px 0 0 -32px', x, y }}
            whileHover={{ scale: 1.15, zIndex: 10 }}
        >
            {icon.initial}
        </motion.div>
    );
};

// --- Main Section Component ---
export const IntegrationsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const innerOrbit = integrations.slice(0, 4);
    const outerOrbit = integrations.slice(4, 8);

    const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } } };
    const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { stiffness: 100, damping: 15 } } };

    return (
        <section ref={ref} className="bg-white py-24 sm:py-32 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.05),_transparent_70%)] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-6">
                        <Link size={16} /><span>Powerful Connections</span>
                    </motion.div>
                    <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                        Integrate with the tools you already love.
                    </motion.h2>
                    <motion.p variants={itemVariants} className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Connect Forma with hundreds of apps like Slack, Google Sheets, and Salesforce to automate workflows, move data seamlessly, and save valuable time.
                    </motion.p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
                    className="relative w-full h-[600px] mt-16 flex items-center justify-center"
                >
                    {/* Central Hub */}
                    <div className="relative w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl z-20 border border-gray-100">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                            F
                        </div>
                    </div>

                    {/* Orbit Rings */}
                    <div className="absolute w-[384px] h-[384px] rounded-full border border-dashed border-gray-200" />
                    <div className="absolute w-[500px] h-[500px] rounded-full border border-dashed border-gray-200" />

                    {/* Inner Orbit */}
                    <motion.div
                        className="absolute w-[384px] h-[384px]"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                    >
                        {innerOrbit.map((icon, index) => (
                            <motion.div
                                key={icon.name}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${(index / innerOrbit.length) * 360}deg) translateX(192px) rotate(-${(index / innerOrbit.length) * 360}deg)` // Counter-rotate to keep icon upright if needed, but here we rotate the whole container so icons rotate with it. To keep icons upright, we'd need to counter-rotate them individually.
                                }}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-lg border-2 border-white ${icon.color} ${icon.textColor || ''} -ml-7 -mt-7 transform hover:scale-110 transition-transform`}>
                                    {icon.initial}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Outer Orbit */}
                    <motion.div
                        className="absolute w-[500px] h-[500px]"
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
                    >
                        {outerOrbit.map((icon, index) => (
                            <motion.div
                                key={icon.name}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: `rotate(${(index / outerOrbit.length) * 360}deg) translateX(250px) rotate(-${(index / outerOrbit.length) * 360}deg)`
                                }}
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-lg border-2 border-white ${icon.color} ${icon.textColor || ''} -ml-8 -mt-8 transform hover:scale-110 transition-transform`}>
                                    {icon.initial}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <Button size="lg" className="group bg-gray-900 text-white hover:bg-gray-800 text-base px-8 py-6 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        Browse all integrations
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};