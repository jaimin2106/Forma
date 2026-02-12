import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ResponsesLineChartProps {
    data: Array<{ date: string; count: number }>;
    loading?: boolean;
}

export function ResponsesLineChart({ data, loading }: ResponsesLineChartProps) {
    if (loading) {
        return (
            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
                <CardContent className="h-[280px] flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                        <div className="h-32 w-full bg-slate-100 rounded" />
                        <div className="h-4 w-24 bg-slate-100 rounded" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-violet-600" />
                        Responses Over Time
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[240px] flex items-center justify-center">
                    <div className="text-center text-slate-400">
                        <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No data to display</p>
                        <p className="text-xs mt-1">Responses will appear here once submissions begin</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card id="chart-responses-line" className="bg-white border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-violet-600" />
                    Responses Over Time
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: '#64748B' }}
                            tickLine={false}
                            axisLine={{ stroke: '#E2E8F0' }}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: '#64748B' }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontSize: '12px',
                            }}
                            labelStyle={{ fontWeight: 600, color: '#0F172A' }}
                            formatter={(value: number) => [`${value} response${value !== 1 ? 's' : ''}`, 'Count']}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8B5CF6"
                            strokeWidth={2.5}
                            dot={{ fill: '#8B5CF6', strokeWidth: 0, r: 3 }}
                            activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#FFFFFF', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
