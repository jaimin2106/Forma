import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Trash2, GripVertical, LineChart, BarChart3, PieChart, AreaChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ChartConfig, ChartType } from '@/contexts/ChartConfigContext';

interface ChartCardProps {
    config: ChartConfig;
    onConfigure: () => void;
    onRemove: () => void;
    children: React.ReactNode;
    loading?: boolean;
}

const chartIcons: Record<ChartType, React.ReactNode> = {
    line: <LineChart className="h-4 w-4" />,
    bar: <BarChart3 className="h-4 w-4" />,
    pie: <PieChart className="h-4 w-4" />,
    area: <AreaChart className="h-4 w-4" />,
};

export function ChartCard({
    config,
    onConfigure,
    onRemove,
    children,
    loading,
}: ChartCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            layout
        >
            <Card className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-violet-100 text-violet-600">
                            {chartIcons[config.type]}
                        </div>
                        <CardTitle className="text-sm font-semibold text-slate-700">
                            {config.title}
                        </CardTitle>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                            onClick={onConfigure}
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={onRemove}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    Remove Chart
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                    <div className="min-h-[200px]">
                        {loading ? (
                            <div className="h-[200px] flex items-center justify-center">
                                <div className="animate-pulse bg-slate-100 rounded-lg w-full h-full" />
                            </div>
                        ) : (
                            children
                        )}
                    </div>

                    {/* Chart metadata */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                            {config.dataSource === 'all' ? 'All Data' : config.dataSource}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                            {config.timeframe === 'all' ? 'All Time' : `Last ${config.timeframe.replace('d', ' Days')}`}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// Add Chart Button Component
interface AddChartButtonProps {
    onClick: () => void;
}

export function AddChartButton({ onClick }: AddChartButtonProps) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClick}
            className="
        min-h-[280px] w-full
        flex flex-col items-center justify-center gap-3
        border-2 border-dashed border-slate-200 rounded-2xl
        text-slate-400 hover:text-violet-600 hover:border-violet-300
        bg-slate-50/50 hover:bg-violet-50/50
        transition-all duration-200
        group
      "
        >
            <div className="p-3 rounded-xl bg-slate-100 group-hover:bg-violet-100 transition-colors">
                <BarChart3 className="h-6 w-6" />
            </div>
            <span className="font-medium">Add Chart</span>
        </motion.button>
    );
}
