import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface DistributionBarChartProps {
    data: Array<{ day: string; count: number }>;
    loading?: boolean;
}

export function DistributionBarChart({ data, loading }: DistributionBarChartProps) {
    if (loading) {
        return (
            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
                <CardContent className="h-[280px] flex items-center justify-center">
                    <div className="animate-pulse flex gap-2 items-end h-32">
                        {[40, 60, 80, 50, 70, 45, 55].map((h, i) => (
                            <div key={i} className="w-6 bg-slate-100 rounded" style={{ height: `${h}%` }} />
                        ))}
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
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        Daily Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[240px] flex items-center justify-center">
                    <div className="text-center text-slate-400">
                        <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No data to display</p>
                        <p className="text-xs mt-1">Distribution will appear after responses come in</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card id="chart-distribution-bar" className="bg-white border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Daily Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <XAxis
                            dataKey="day"
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
                        <Bar
                            dataKey="count"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
