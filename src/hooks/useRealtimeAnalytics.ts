import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import type { RealtimeChannel, RealtimePostgresInsertPayload } from '@supabase/supabase-js';

type FormResponse = Tables<'form_responses'>;

export interface RealtimeAnalyticsState {
    totalResponses: number;
    responsesToday: number;
    verifiedCount: number;
    anonymousCount: number;
    weeklyChange: number;
    trendData: Array<{ date: string; count: number }>;
    distributionData: Array<{ day: string; count: number }>;
    sparklineData: number[];
    isConnected: boolean;
    lastUpdate: Date | null;
}

interface UseRealtimeAnalyticsOptions {
    formId: string;
    enabled?: boolean;
    onNewResponse?: (response: FormResponse) => void;
}

export function useRealtimeAnalytics({ formId, enabled = true, onNewResponse }: UseRealtimeAnalyticsOptions) {
    const [state, setState] = useState<RealtimeAnalyticsState>({
        totalResponses: 0,
        responsesToday: 0,
        verifiedCount: 0,
        anonymousCount: 0,
        weeklyChange: 0,
        trendData: [],
        distributionData: [],
        sparklineData: [],
        isConnected: false,
        lastUpdate: null,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const channelRef = useRef<RealtimeChannel | null>(null);

    // Calculate analytics from responses
    const calculateAnalytics = useCallback((responses: FormResponse[]): Omit<RealtimeAnalyticsState, 'isConnected' | 'lastUpdate'> => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Count metrics
        const totalResponses = responses.length;
        const responsesToday = responses.filter(r => new Date(r.submitted_at) >= today).length;
        const verifiedCount = responses.filter(r => !!r.respondent_email).length;
        const anonymousCount = totalResponses - verifiedCount;

        // Weekly change
        const thisWeek = responses.filter(r => new Date(r.submitted_at) >= oneWeekAgo).length;
        const lastWeek = responses.filter(r => {
            const date = new Date(r.submitted_at);
            return date >= twoWeeksAgo && date < oneWeekAgo;
        }).length;
        const weeklyChange = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

        // Trend data (last 14 days)
        const trendMap: Record<string, number> = {};
        for (let i = 13; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            trendMap[dateStr] = 0;
        }
        responses.forEach(r => {
            const dateStr = new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (trendMap[dateStr] !== undefined) {
                trendMap[dateStr]++;
            }
        });
        const trendData = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

        // Distribution data (by day of week)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayCounts = new Array(7).fill(0);
        responses.forEach(r => {
            const dayIndex = new Date(r.submitted_at).getDay();
            dayCounts[dayIndex]++;
        });
        const distributionData = days.map((day, i) => ({ day, count: dayCounts[i] }));

        // Sparkline data (last 14 days counts)
        const sparklineData: number[] = [];
        for (let i = 13; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = responses.filter(r => r.submitted_at.startsWith(dateStr)).length;
            sparklineData.push(count);
        }

        return {
            totalResponses,
            responsesToday,
            verifiedCount,
            anonymousCount,
            weeklyChange,
            trendData,
            distributionData,
            sparklineData,
        };
    }, []);

    // Fetch initial analytics
    const fetchAnalytics = useCallback(async () => {
        if (!formId) return;

        setIsLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('form_responses')
                .select('*')
                .eq('form_id', formId)
                .order('submitted_at', { ascending: false });

            if (fetchError) throw fetchError;

            const analytics = calculateAnalytics(data || []);
            setState(prev => ({
                ...prev,
                ...analytics,
                lastUpdate: new Date(),
            }));
        } catch (err: any) {
            console.error('Error fetching analytics:', err);
            setError(err.message || 'Failed to load analytics');
        } finally {
            setIsLoading(false);
        }
    }, [formId, calculateAnalytics]);

    // Handle realtime insert event
    const handleRealtimeInsert = useCallback((payload: RealtimePostgresInsertPayload<FormResponse>) => {
        const newResponse = payload.new;
        console.log('[Realtime] 🔔 New response received:', newResponse.id, newResponse.respondent_email || 'anonymous');

        // Notify parent component of new response
        onNewResponse?.(newResponse);

        setState(prev => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const responseDate = new Date(newResponse.submitted_at);
            const isToday = responseDate >= today;
            const isVerified = !!newResponse.respondent_email;

            // Update counters
            const totalResponses = prev.totalResponses + 1;
            const responsesToday = isToday ? prev.responsesToday + 1 : prev.responsesToday;
            const verifiedCount = isVerified ? prev.verifiedCount + 1 : prev.verifiedCount;
            const anonymousCount = !isVerified ? prev.anonymousCount + 1 : prev.anonymousCount;

            // Update trend data
            const dateStr = responseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const trendData = prev.trendData.map(item =>
                item.date === dateStr ? { ...item, count: item.count + 1 } : item
            );

            // Update distribution data
            const dayIndex = responseDate.getDay();
            const distributionData = prev.distributionData.map((item, i) =>
                i === dayIndex ? { ...item, count: item.count + 1 } : item
            );

            // Update sparkline (increment today's value)
            const sparklineData = [...prev.sparklineData];
            if (sparklineData.length > 0) {
                sparklineData[sparklineData.length - 1]++;
            }

            return {
                ...prev,
                totalResponses,
                responsesToday,
                verifiedCount,
                anonymousCount,
                trendData,
                distributionData,
                sparklineData,
                lastUpdate: new Date(),
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onNewResponse]);

    // Subscribe to realtime updates
    useEffect(() => {
        if (!enabled || !formId) return;

        // Initial fetch
        fetchAnalytics();

        // Set up realtime subscription
        const channel = supabase
            .channel(`form_responses:${formId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'form_responses',
                    filter: `form_id=eq.${formId}`,
                },
                handleRealtimeInsert
            )
            .subscribe((status) => {
                console.log('[Realtime] Subscription status:', status, 'for form:', formId);
                setState(prev => ({
                    ...prev,
                    isConnected: status === 'SUBSCRIBED',
                }));
            });

        channelRef.current = channel;

        // Cleanup
        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [formId, enabled, fetchAnalytics, handleRealtimeInsert]);

    // Manual refresh function (fallback)
    const refresh = useCallback(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        ...state,
        isLoading,
        error,
        refresh,
    };
}
