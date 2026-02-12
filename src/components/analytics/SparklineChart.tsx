import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
    data: number[];
    color?: string;
    height?: number;
}

export function SparklineChart({ data, color = '#8B5CF6', height = 32 }: SparklineChartProps) {
    const chartData = data.map((value, index) => ({ value, index }));

    if (data.length === 0) {
        return (
            <div style={{ height }} className="flex items-center justify-center">
                <div className="h-px w-full bg-slate-200" />
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={chartData}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
