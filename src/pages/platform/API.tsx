import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Code, Terminal, Key, Book } from "lucide-react";

const API = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
                            <Code size={16} />
                            <span>Developer First</span>
                        </div>
                        <h1 className="text-5xl font-bold leading-tight">
                            Build on top of <br />
                            <span className="text-violet-400">Forma API</span>
                        </h1>
                        <p className="text-xl text-slate-300">
                            Programmatically create forms, retrieve responses, and manage webhooks. Built for developers who need flexibility.
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white">
                                Read Documentation
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-slate-700 hover:bg-slate-800">
                                Get API Key
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-8">
                            {[
                                { icon: Terminal, bg: "API Reference", text: "Comprehensive endpoints" },
                                { icon: Key, bg: "Authentication", text: "Secure Bearer tokens" },
                                { icon: Book, bg: "SDKs", text: "Node, Python, Go" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1">
                                        <item.icon className="text-violet-400" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{item.bg}</h4>
                                        <p className="text-sm text-slate-400">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Code Block */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-950 rounded-xl border border-slate-800 p-6 font-mono text-sm shadow-2xl overflow-hidden"
                    >
                        <div className="flex gap-2 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-slate-500"># Fetch form responses</p>
                            <p>
                                <span className="text-pink-500">curl</span>
                                <span className="text-green-400"> https://api.forma.app/v1/responses</span> \
                            </p>
                            <p className="pl-4">
                                -H <span className="text-yellow-300">"Authorization: Bearer YOUR_API_KEY"</span> \
                            </p>
                            <p className="pl-4">
                                -d <span className="text-yellow-300">"form_id=fm_12345"</span>
                            </p>
                            <br />
                            <p className="text-slate-500">// Response</p>
                            <p className="text-blue-400">{"{"}</p>
                            <p className="pl-4">
                                <span className="text-violet-400">"data"</span>: [
                            </p>
                            <p className="pl-8">
                                {"{"} <span className="text-violet-400">"id"</span>: <span className="text-yellow-300">"resp_987"</span>, ... {"}"}
                            </p>
                            <p className="pl-4">]</p>
                            <p className="text-blue-400">{"}"}</p>
                        </div>
                    </motion.div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default API;
