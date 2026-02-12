import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link2 } from "lucide-react";
import { motion, useInView } from "framer-motion";

// --- Integration Data with SVG Logos ---
const integrations = [
    {
        name: "Slack",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg"
    },
    {
        name: "Google Drive",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
    },
    {
        name: "Salesforce",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg"
    },
    {
        name: "Notion",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg"
    },
    {
        name: "Trello",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg"
    },
    {
        name: "GitHub",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
    },
    {
        name: "Jira",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg"
    },
    {
        name: "Figma",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg"
    },
    {
        name: "Dropbox",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dropbox/dropbox-original.svg"
    },
    {
        name: "VS Code",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg"
    },
    {
        name: "Firebase",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg"
    },
    {
        name: "MongoDB",
        logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
    }
];

// --- Integration Logo Component ---
const IntegrationLogo = ({ integration }: { integration: typeof integrations[0] }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.1, y: -4 }}
            className="flex-shrink-0 group cursor-pointer"
            title={integration.name}
        >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3 group-hover:shadow-lg group-hover:border-violet-200 transition-all duration-300">
                <img
                    src={integration.logo}
                    alt={integration.name}
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300"
                    loading="lazy"
                />
            </div>
            <p className="text-xs text-gray-500 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {integration.name}
            </p>
        </motion.div>
    );
};

// --- Main Section Component ---
export const IntegrationsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section ref={ref} className="bg-slate-50 py-20 sm:py-24 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.03),_transparent_70%)] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center"
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-violet-600 text-sm font-medium mb-6"
                    >
                        <Link2 size={16} />
                        <span>100+ Integrations</span>
                    </motion.div>

                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight"
                    >
                        Connect with tools you already love
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    >
                        Seamlessly integrate Forma with Slack, Google Sheets, Salesforce, and hundreds more to automate your workflows.
                    </motion.p>
                </motion.div>

                {/* Horizontal Scrollable Integration Strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-12 relative"
                >
                    {/* Gradient Fade Edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

                    {/* Scrollable Container */}
                    <div className="flex items-center gap-6 overflow-x-auto py-4 px-8 scrollbar-hide">
                        {integrations.map((integration) => (
                            <IntegrationLogo key={integration.name} integration={integration} />
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-10"
                >
                    <Button
                        variant="outline"
                        size="lg"
                        className="group border-gray-300 text-gray-700 hover:bg-white hover:border-gray-400 text-base px-6 py-5 rounded-full font-semibold transition-all duration-300"
                    >
                        Browse all integrations
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};