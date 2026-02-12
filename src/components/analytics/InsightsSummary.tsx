import { Lightbulb, TrendingUp, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InsightsSummaryProps {
    totalResponses: number;
    verifiedCount: number;
    anonymousCount: number;
    weeklyChange?: number;
    peakHour?: number;
}

export function InsightsSummary({
    totalResponses,
    verifiedCount,
    anonymousCount,
    weeklyChange = 0,
    peakHour,
}: InsightsSummaryProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const verifiedRatio = totalResponses > 0 ? Math.round((verifiedCount / totalResponses) * 100) : 0;

    const insights: Array<{ icon: typeof Lightbulb; text: string; color: string }> = [];

    // Trend insight
    if (weeklyChange > 0) {
        insights.push({
            icon: TrendingUp,
            text: `Response rate increased by ${weeklyChange}% compared to last week.`,
            color: 'text-emerald-600',
        });
    } else if (weeklyChange < 0) {
        insights.push({
            icon: TrendingUp,
            text: `Response rate decreased by ${Math.abs(weeklyChange)}% compared to last week.`,
            color: 'text-red-600',
        });
    }

    // Verification insight
    if (verifiedRatio >= 70) {
        insights.push({
            icon: Users,
            text: `${verifiedRatio}% of respondents provided verified email addresses — excellent engagement quality.`,
            color: 'text-emerald-600',
        });
    } else if (verifiedRatio >= 40) {
        insights.push({
            icon: Users,
            text: `${verifiedRatio}% of responses are from verified users. Consider incentivizing email collection.`,
            color: 'text-amber-600',
        });
    } else if (totalResponses > 0) {
        insights.push({
            icon: Users,
            text: `Only ${verifiedRatio}% of responses include emails. Enable email collection for better follow-up.`,
            color: 'text-slate-600',
        });
    }

    // Peak time insight
    if (peakHour !== undefined) {
        const hour12 = peakHour > 12 ? peakHour - 12 : peakHour;
        const ampm = peakHour >= 12 ? 'PM' : 'AM';
        insights.push({
            icon: Clock,
            text: `Most responses arrive around ${hour12}:00 ${ampm}. Consider timing your form distribution accordingly.`,
            color: 'text-blue-600',
        });
    }

    if (insights.length === 0 && totalResponses === 0) {
        return null; // Don't show panel if no responses
    }

    if (insights.length === 0) {
        insights.push({
            icon: Lightbulb,
            text: 'Collect more responses to unlock AI-powered insights about your form performance.',
            color: 'text-slate-500',
        });
    }

    return (
        <Card className="bg-[#F8FAFC] border border-slate-200 shadow-sm rounded-xl mb-6">
            <CardContent className="p-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                            <Lightbulb className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">AI Insights</span>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {insights.length} insight{insights.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-3 space-y-2">
                                {insights.map((insight, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <insight.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${insight.color}`} />
                                        <p className="text-slate-600">{insight.text}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
