import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";
import { Plug, Grid, Database, MessageSquare } from "lucide-react";

const Integrations = () => {
    // Mock integration data
    const categories = [
        {
            name: "CRM",
            apps: ["Salesforce", "HubSpot", "Pipedrive", "Zoho"]
        },
        {
            name: "Productivity",
            apps: ["Slack", "Notion", "Trello", "Asana"]
        },
        {
            name: "Marketing",
            apps: ["Mailchimp", "ActiveCampaign", "Klaviyo", "Drip"]
        },
        {
            name: "Storage",
            apps: ["Google Drive", "Dropbox", "OneDrive", "Box"]
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Connect with Your Favorite Tools
                    </h1>
                    <p className="text-xl text-slate-600">
                        Streamline your workflow by integrating Forma with 100+ apps you already use.
                    </p>
                </div>

                <div className="grid gap-12">
                    {categories.map((cat, i) => (
                        <div key={i}>
                            <h3 className="text-2xl font-semibold text-slate-800 mb-6">{cat.name}</h3>
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {cat.apps.map((app, j) => (
                                    <motion.div
                                        key={app}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: j * 0.05 }}
                                        className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-violet-500 hover:bg-violet-50/10 cursor-pointer transition-all"
                                    >
                                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold">
                                            {app[0]}
                                        </div>
                                        <span className="font-medium text-slate-700">{app}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Integrations;
