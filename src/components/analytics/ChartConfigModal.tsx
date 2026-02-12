import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LineChart, BarChart3, PieChart, AreaChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { ChartConfig, ChartType, DataSource, Timeframe } from '@/contexts/ChartConfigContext';

interface ChartConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: Omit<ChartConfig, 'id' | 'order'>) => void;
    initialConfig?: ChartConfig;
    mode: 'add' | 'edit';
}

const chartTypeOptions: { value: ChartType; label: string; icon: React.ReactNode }[] = [
    { value: 'line', label: 'Line', icon: <LineChart className="h-4 w-4" /> },
    { value: 'bar', label: 'Bar', icon: <BarChart3 className="h-4 w-4" /> },
    { value: 'pie', label: 'Pie', icon: <PieChart className="h-4 w-4" /> },
    { value: 'area', label: 'Area', icon: <AreaChart className="h-4 w-4" /> },
];

const dataSourceOptions: { value: DataSource; label: string }[] = [
    { value: 'all', label: 'All Responses' },
    { value: 'verified', label: 'Verified Only' },
    { value: 'anonymous', label: 'Anonymous Only' },
];

const timeframeOptions: { value: Timeframe; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '14d', label: 'Last 14 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' },
];

export function ChartConfigModal({
    isOpen,
    onClose,
    onSave,
    initialConfig,
    mode,
}: ChartConfigModalProps) {
    const [title, setTitle] = useState(initialConfig?.title || 'New Chart');
    const [chartType, setChartType] = useState<ChartType>(initialConfig?.type || 'line');
    const [dataSource, setDataSource] = useState<DataSource>(initialConfig?.dataSource || 'all');
    const [timeframe, setTimeframe] = useState<Timeframe>(initialConfig?.timeframe || '14d');

    useEffect(() => {
        if (initialConfig) {
            setTitle(initialConfig.title);
            setChartType(initialConfig.type);
            setDataSource(initialConfig.dataSource);
            setTimeframe(initialConfig.timeframe);
        }
    }, [initialConfig]);

    const handleSave = () => {
        onSave({
            title,
            type: chartType,
            dataSource,
            timeframe,
            visible: true,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {mode === 'add' ? 'Add Chart' : 'Configure Chart'}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Chart Title */}
                        <div className="space-y-2">
                            <Label htmlFor="chart-title">Chart Title</Label>
                            <Input
                                id="chart-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter chart title"
                                className="h-11"
                            />
                        </div>

                        {/* Chart Type */}
                        <div className="space-y-2">
                            <Label>Chart Type</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {chartTypeOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setChartType(option.value)}
                                        className={`
                      flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                      ${chartType === option.value
                                                ? 'border-violet-500 bg-violet-50 text-violet-700'
                                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                            }
                    `}
                                    >
                                        {option.icon}
                                        <span className="text-xs font-medium mt-1">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Data Source */}
                        <div className="space-y-2">
                            <Label>Data Source</Label>
                            <Select value={dataSource} onValueChange={(v) => setDataSource(v as DataSource)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataSourceOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Timeframe */}
                        <div className="space-y-2">
                            <Label>Timeframe</Label>
                            <Select value={timeframe} onValueChange={(v) => setTimeframe(v as Timeframe)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeframeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
                            {mode === 'add' ? 'Add Chart' : 'Save Changes'}
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
