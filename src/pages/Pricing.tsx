import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/landing/Footer";

const plans = [
    {
        name: "Starter",
        price: "$0",
        description: "Perfect for personal projects and small experiments.",
        features: [
            "Up to 3 forms",
            "100 responses / month",
            "Basic Analytics",
            "Standard Support",
            "Community Access",
        ],
        notIncluded: ["AI Insights", "Custom Branding", "Export to Excel", "Team Collaboration"],
        cta: "Start for Free",
        popular: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "For professionals and growing teams needing power.",
        features: [
            "Unlimited forms",
            "5,000 responses / month",
            "Advanced AI Analytics",
            "Priority Support",
            "Custom Branding (No Logo)",
            "Export to CSV/Excel",
        ],
        notIncluded: ["Dedicated Success Manager", "SSO"],
        cta: "Get Started",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Tailored solutions for large-scale organizations.",
        features: [
            "Unlimited Everything",
            "Dedicated Success Manager",
            "SLA & Priority Support",
            "SSO & Advanced Security",
            "Custom AI Model Training",
            "On-premise Deployment Options",
        ],
        notIncluded: [],
        cta: "Contact Sales",
        popular: false,
    },
];

const Pricing = () => {
    return (
        <div className="min-h-screen bg-white pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-6">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-xl text-slate-500">
                        Choose the perfect plan for your needs. No hidden fees. Cancel anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative rounded-2xl p-8 border ${plan.popular
                                    ? "border-violet-600 bg-violet-50/50 shadow-xl scale-105 z-10"
                                    : "border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-3 py-1 text-sm font-medium rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                                <div className="flex items-baseline mt-4 mb-2">
                                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                    {plan.period && <span className="text-slate-500 ml-1">{plan.period}</span>}
                                </div>
                                <p className="text-slate-500 text-sm">{plan.description}</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-slate-700">{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3 opacity-50">
                                        <X className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                        <span className="text-sm text-slate-500">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                className={`w-full h-12 rounded-xl font-medium ${plan.popular
                                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200"
                                        : "bg-slate-900 hover:bg-slate-800 text-white"
                                    }`}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Pricing;
