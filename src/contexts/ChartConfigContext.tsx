import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Chart configuration types
export type ChartType = 'line' | 'bar' | 'pie' | 'area';
export type DataSource = 'all' | 'verified' | 'anonymous';
export type Timeframe = '7d' | '14d' | '30d' | 'all';

export interface ChartConfig {
    id: string;
    type: ChartType;
    title: string;
    dataSource: DataSource;
    timeframe: Timeframe;
    visible: boolean;
    order: number;
}

interface ChartConfigContextType {
    charts: ChartConfig[];
    addChart: (chart: Omit<ChartConfig, 'id' | 'order'>) => void;
    removeChart: (id: string) => void;
    updateChart: (id: string, updates: Partial<ChartConfig>) => void;
    reorderCharts: (startIndex: number, endIndex: number) => void;
    resetToDefaults: () => void;
}

const STORAGE_KEY = 'forma_chart_config';

// Default chart configuration
const defaultCharts: ChartConfig[] = [
    {
        id: 'responses-trend',
        type: 'line',
        title: 'Response Trend',
        dataSource: 'all',
        timeframe: '14d',
        visible: true,
        order: 0,
    },
    {
        id: 'daily-distribution',
        type: 'bar',
        title: 'Daily Distribution',
        dataSource: 'all',
        timeframe: '14d',
        visible: true,
        order: 1,
    },
    {
        id: 'type-breakdown',
        type: 'pie',
        title: 'Response Types',
        dataSource: 'all',
        timeframe: 'all',
        visible: true,
        order: 2,
    },
];

const ChartConfigContext = createContext<ChartConfigContextType | undefined>(undefined);

export function ChartConfigProvider({ children }: { children: React.ReactNode }) {
    const [charts, setCharts] = useState<ChartConfig[]>(() => {
        // Load from localStorage on init
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load chart config:', e);
        }
        return defaultCharts;
    });

    // Persist to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(charts));
        } catch (e) {
            console.error('Failed to save chart config:', e);
        }
    }, [charts]);

    const addChart = useCallback((chart: Omit<ChartConfig, 'id' | 'order'>) => {
        const id = `chart-${Date.now()}`;
        const order = charts.length;
        setCharts(prev => [...prev, { ...chart, id, order }]);
    }, [charts.length]);

    const removeChart = useCallback((id: string) => {
        setCharts(prev => {
            const filtered = prev.filter(c => c.id !== id);
            // Reorder remaining charts
            return filtered.map((c, i) => ({ ...c, order: i }));
        });
    }, []);

    const updateChart = useCallback((id: string, updates: Partial<ChartConfig>) => {
        setCharts(prev => prev.map(c =>
            c.id === id ? { ...c, ...updates } : c
        ));
    }, []);

    const reorderCharts = useCallback((startIndex: number, endIndex: number) => {
        setCharts(prev => {
            const result = Array.from(prev);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            // Update order indices
            return result.map((c, i) => ({ ...c, order: i }));
        });
    }, []);

    const resetToDefaults = useCallback(() => {
        setCharts(defaultCharts);
    }, []);

    return (
        <ChartConfigContext.Provider value={{
            charts,
            addChart,
            removeChart,
            updateChart,
            reorderCharts,
            resetToDefaults,
        }}>
            {children}
        </ChartConfigContext.Provider>
    );
}

export function useChartConfig() {
    const context = useContext(ChartConfigContext);
    if (!context) {
        throw new Error('useChartConfig must be used within ChartConfigProvider');
    }
    return context;
}
