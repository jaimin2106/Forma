import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';

interface TypeBreakdownChartProps {
    verified: number;
    anonymous: number;
    loading?: boolean;
}

const COLORS = ['#22C55E', '#8B5CF6'];

export function TypeBreakdownChart({ verified, anonymous, loading }: TypeBreakdownChartProps) {
    const data = [
        { name: 'Verified', value: verified },
        { name: 'Anonymous', value: anonymous },
    ];

    const total = verified + anonymous;

    if (loading) {
        return (
            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
                <CardContent className="h-[280px] flex items-center justify-center">
                    <div className="animate-pulse">
                        <div className="h-32 w-32 rounded-full bg-slate-100" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (total === 0) {
        return (
            <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <PieChartIcon className="h-4 w-4 text-emerald-600" />
                        Response Types
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[240px] flex items-center justify-center">
                    <div className="text-center text-slate-400">
                        <PieChartIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No data to display</p>
                        <p className="text-xs mt-1">Type breakdown will appear here</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card id="chart-type-breakdown" className="bg-white border border-slate-200 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-emerald-600" />
                    Response Types
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="45%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                fontSize: '12px',
                            }}
                            formatter={(value: number, name: string) => [
                                `${value} (${Math.round((value / total) * 100)}%)`,
                                name,
                            ]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '12px' }}
                            formatter={(value) => <span className="text-slate-600">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
