"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, useInView } from "framer-motion";
import { Twitter, Linkedin, Facebook, ArrowRight, Github, Instagram } from "lucide-react";

// --- Data for Footer Links (Easy to update) ---
const footerLinks = [
    {
        title: "Product",
        links: ["Features", "Pricing", "Integrations", "Templates", "Security"],
    },
    {
        title: "Solutions",
        links: ["Marketing", "Product Teams", "Human Resources", "Customer Success"],
    },
    {
        title: "Resources",
        links: ["Blog", "Help Center", "Community", "API Docs"],
    },
    {
        title: "Company",
        links: ["About Us", "Careers", "Contact", "Press"],
    },
];

const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Github, label: "GitHub", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
];

// --- Reusable Sub-Components ---
const FooterLinkColumn = ({ title, links }: { title: string; links: string[] }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { stiffness: 100, damping: 15 } }
    };
    return (
        <motion.div variants={itemVariants}>
            <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">{title}</h3>
            <ul className="space-y-3">
                {links.map((link) => (
                    <li key={link}>
                        <a href="#" className="text-gray-500 hover:text-violet-600 transition-colors duration-200 text-sm font-medium">
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};


// --- Main Footer Component ---
export const Footer = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <footer ref={ref} className="bg-white pt-24 pb-12 border-t border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.03),_transparent_40%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.03),_transparent_40%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {/* Top Section: Links and Newsletter */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
                        <div className="col-span-2 md:col-span-4 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    F
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Forma</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                                The most powerful way to collect data, feedback, and leads. Beautiful forms that convert.
                            </p>
                            <div className="flex gap-4">
                                {socialLinks.map(({ icon: Icon, label, href }) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        whileHover={{ y: -2, scale: 1.1 }}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition-all duration-300"
                                    >
                                        <Icon size={16} />
                                    </motion.a>
                                ))}
                            </div>
                        </div>

                        {footerLinks.map((column) => (
                            <FooterLinkColumn key={column.title} {...column} />
                        ))}
                    </div>

                    {/* Newsletter Section */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { stiffness: 100, damping: 15 } } }}
                        className="bg-gray-50 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-100"
                    >
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Stay in the loop</h3>
                            <p className="text-gray-500 text-sm">Join our newsletter for the latest features and releases.</p>
                        </div>
                        <form className="flex w-full md:w-auto gap-2">
                            <Input type="email" placeholder="Enter your email" className="bg-white border-gray-200 focus:border-violet-500 min-w-[240px]" />
                            <Button className="bg-gray-900 text-white hover:bg-gray-800">
                                Subscribe
                            </Button>
                        </form>
                    </motion.div>

                    {/* Bottom Section: Copyright and Legal */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500"
                    >
                        <p>&copy; 2025 Forma. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
};