import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Download,
    FileText,
    Table,
    BarChart3,
    Calendar,
    CheckSquare,
    Square,
    FileSpreadsheet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (config: ExportConfig) => void;
    totalResponses: number;
    chartCount: number;
    fields: { id: string; label: string }[];
}

export interface ExportConfig {
    dateRange: '7d' | '14d' | '30d' | 'all' | 'custom';
    exportType: 'full' | 'charts' | 'raw';
    includeCharts: boolean;
    includeInsights: boolean;
    includeRespondentData: boolean;
    includeStats: boolean;
    selectedFields: string[];
    format: 'pdf' | 'csv' | 'xlsx';
}

const dateRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '14d', label: 'Last 14 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' },
];

export function ExportModal({
    isOpen,
    onClose,
    onExport,
    totalResponses,
    chartCount,
    fields,
}: ExportModalProps) {
    const [dateRange, setDateRange] = useState<ExportConfig['dateRange']>('all');
    const [exportType, setExportType] = useState<ExportConfig['exportType']>('full');
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeInsights, setIncludeInsights] = useState(true);
    const [includeRespondentData, setIncludeRespondentData] = useState(false);
    const [includeStats, setIncludeStats] = useState(true);
    const [selectedFields, setSelectedFields] = useState<string[]>(fields.map(f => f.id));

    const toggleField = (fieldId: string) => {
        setSelectedFields(prev =>
            prev.includes(fieldId)
                ? prev.filter(id => id !== fieldId)
                : [...prev, fieldId]
        );
    };

    const handleExport = () => {
        onExport({
            dateRange,
            exportType,
            includeCharts,
            includeInsights,
            includeRespondentData,
            includeStats,
            selectedFields,
            format: exportType === 'raw' ? 'csv' : 'pdf',
        });
        onClose();
    };

    // Calculate preview stats
    const estimatedPages = exportType === 'full' ? Math.ceil(totalResponses / 10) + chartCount :
        exportType === 'charts' ? Math.ceil(chartCount / 2) : 1;

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
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-violet-100">
                                <Download className="h-5 w-5 text-violet-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                Export Analytics Report
                            </h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Date Range */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-sm font-medium">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                Date Range
                            </Label>
                            <Select value={dateRange} onValueChange={(v) => setDateRange(v as any)}>
                                <SelectTrigger className="h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {dateRangeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Export Type */}
                        <div className="space-y-3">
                            <Label className="flex items-center gap-2 text-sm font-medium">
                                <FileText className="h-4 w-4 text-slate-400" />
                                Export Type
                            </Label>
                            <div className="space-y-2">
                                {[
                                    { value: 'full', label: 'Full Analytics Report', desc: 'Charts, insights, and all data', icon: FileText },
                                    { value: 'charts', label: 'Charts Only', desc: 'Export visualizations as PDF', icon: BarChart3 },
                                    { value: 'raw', label: 'Raw Responses', desc: 'Export data as CSV/Excel', icon: Table },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setExportType(option.value as any)}
                                        className={`
                      w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all
                      ${exportType === option.value
                                                ? 'border-violet-500 bg-violet-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }
                    `}
                                    >
                                        <div className={`p-2 rounded-lg ${exportType === option.value ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <option.icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{option.label}</p>
                                            <p className="text-sm text-slate-500">{option.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Include Options - Only for Full/Charts */}
                        {exportType !== 'raw' && (
                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Include in Export</Label>
                                <div className="space-y-2">
                                    {[
                                        { key: 'includeCharts', label: 'Analytics Charts', checked: includeCharts, set: setIncludeCharts },
                                        { key: 'includeInsights', label: 'AI Insights Summary', checked: includeInsights, set: setIncludeInsights },
                                        { key: 'includeStats', label: 'Response Statistics', checked: includeStats, set: setIncludeStats },
                                        { key: 'includeRespondentData', label: 'Respondent Personal Data', checked: includeRespondentData, set: setIncludeRespondentData },
                                    ].map((option) => (
                                        <button
                                            key={option.key}
                                            onClick={() => option.set(!option.checked)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            {option.checked ? (
                                                <CheckSquare className="h-5 w-5 text-violet-600" />
                                            ) : (
                                                <Square className="h-5 w-5 text-slate-300" />
                                            )}
                                            <span className="text-sm text-slate-700">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Field Selection - Always visible */}
                        {fields.length > 0 && (
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                                    Select Fields to Export
                                </Label>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500">
                                        {selectedFields.length} of {fields.length} fields selected
                                    </span>
                                    <button
                                        onClick={() => setSelectedFields(
                                            selectedFields.length === fields.length ? [] : fields.map(f => f.id)
                                        )}
                                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                                    >
                                        {selectedFields.length === fields.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>
                                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1">
                                    {fields.map((field) => (
                                        <button
                                            key={field.id}
                                            onClick={() => toggleField(field.id)}
                                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            {selectedFields.includes(field.id) ? (
                                                <CheckSquare className="h-4 w-4 text-violet-600 flex-shrink-0" />
                                            ) : (
                                                <Square className="h-4 w-4 text-slate-300 flex-shrink-0" />
                                            )}
                                            <span className="text-sm text-slate-700 truncate">{field.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-200 bg-slate-50 p-6">
                        {/* Preview */}
                        <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200">
                            <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-900">Preview:</span>{' '}
                                {totalResponses} responses
                                {exportType !== 'raw' && `, ${chartCount} charts`}
                                {exportType !== 'raw' && `, ~${estimatedPages} pages`}
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleExport} className="bg-violet-600 hover:bg-violet-700">
                                <Download className="h-4 w-4 mr-2" />
                                Export Report
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
