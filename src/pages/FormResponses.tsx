import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, MotionConfig, useReducedMotion } from 'framer-motion';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { useRealtimeAnalytics } from '@/hooks/useRealtimeAnalytics';

import {
  ArrowLeft,
  List,
  XCircle,
  Users,
  Mail,
  ShieldOff,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  TrendingUp,
  Share2,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  Zap,
  Trash2,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Tables } from '@/integrations/supabase/types';

// Analytics Components
import {
  ResponsesLineChart,
  DistributionBarChart,
  TypeBreakdownChart,
  SparklineChart,
  InsightsSummary,
  ExportModal,
  ChartConfigModal,
  ChartCard,
  AddChartButton,
} from '@/components/analytics';
import type { ExportConfig } from '@/components/analytics';
import { ChartConfigProvider, useChartConfig } from '@/contexts/ChartConfigContext';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';

// ================================================================
// 1. TYPES
// ================================================================
export type Question = Tables<'questions'>;
export interface FormResponseWithAnswers extends Tables<'form_responses'> {
  answers: Record<string, any>;
}
export interface SummaryStats {
  total: number;
  withEmail: number;
  anonymous: number;
  weeklyChange?: number;
}

// ================================================================
// 2. TOKENS & HOOKS
// ================================================================
const TOKENS = {
  radius: 'rounded-xl',
  panel: 'bg-white border-slate-200 shadow-sm',
  border: 'border border-slate-200',
  shadowSoft: 'shadow-sm',
  shadowHover: 'hover:shadow-md transition-shadow duration-200',
  gradientHeader: 'bg-white',
  textSubtle: 'text-slate-500',
  textMain: 'text-slate-900 font-medium',
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    setMatches(media.matches);
    media.addEventListener?.('change', listener);
    return () => media.removeEventListener?.('change', listener);
  }, [query]);
  return matches;
};

// ================================================================
// 3. HELPERS
// ================================================================
const formatAnswerForDisplay = (question: Question, answer: any) => {
  if (answer === null || typeof answer === 'undefined') {
    return <span className="text-slate-400 italic">No response</span>;
  }
  switch (question.type) {
    case 'checkbox':
      return Array.isArray(answer) ? answer.join(', ') : String(answer);
    case 'rating':
      return `${answer} / 5`;
    case 'date':
      return new Date(answer).toLocaleDateString();
    default:
      return String(answer);
  }
};

const formatAnswerForExport = (question: Question, answer: any): string => {
  if (answer === null || typeof answer === 'undefined') return 'No response';
  switch (question.type) {
    case 'checkbox':
      return Array.isArray(answer) ? answer.join('; ') : String(answer);
    case 'rating':
      return `${answer} / 5`;
    case 'date':
      return new Date(answer).toLocaleDateString();
    default:
      return String(answer);
  }
};

// ================================================================
// 4. SKELETONS & SMALL UI
// ================================================================
function FormResponsesSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div>
              <Skeleton className="h-6 w-56 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md mt-2" />
            </div>
          </div>
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white border border-slate-200">
              <CardContent className="p-5">
                <Skeleton className="h-4 w-24 rounded-md mb-3" />
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-8 w-full mt-3 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-white border border-slate-200">
              <CardContent className="h-[280px] flex items-center justify-center">
                <Skeleton className="h-32 w-32 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className={`rounded-xl ${TOKENS.panel} ${TOKENS.border} ${TOKENS.shadowSoft}`}>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-5 w-1/6 rounded-md" />
                <Skeleton className="h-5 w-2/6 rounded-md" />
                <Skeleton className="h-5 w-1/6 rounded-md" />
                <Skeleton className="h-5 w-2/6 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// 5. ENHANCED PREMIUM ANALYTICS CARDS
// ================================================================
interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  gradient?: string;
  sparklineData?: number[];
  change?: number;
  caption?: string;
  isLive?: boolean;
  pulseOnUpdate?: boolean;
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
  gradient,
  sparklineData,
  change,
  caption,
  isLive,
  pulseOnUpdate
}: MetricCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  // Animate on value change
  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div className={`
        relative overflow-hidden
        bg-gradient-to-br ${gradient || 'from-slate-50 to-white'}
        border border-white/60 rounded-2xl
        shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.04)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]
        hover:-translate-y-0.5
        transition-all duration-300 ease-out
        backdrop-blur-sm
        ${isAnimating ? 'ring-2 ring-violet-400/40 ring-offset-2' : ''}
      `}>
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

        {/* Gradient accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient || 'from-violet-500 to-purple-600'} opacity-80`} />

        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white" />
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
          </div>
        )}

        <div className="relative p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-1">
                {title}
              </p>
              <motion.p
                className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none"
                animate={isAnimating ? { scale: [1, 1.08, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </motion.p>
            </div>
            <div className={`
              p-3 md:p-4 rounded-xl ${bg}
              shadow-lg shadow-black/5
              group-hover:scale-110 group-hover:rotate-3
              transition-all duration-300 ease-out
            `}>
              <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} aria-hidden="true" />
            </div>
          </div>

          {/* Sparkline */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="mt-4 h-12 -mx-1">
              <SparklineChart
                data={sparklineData}
                color={color.includes('blue') ? '#3B82F6' : color.includes('green') ? '#10B981' : color.includes('amber') ? '#F59E0B' : '#8B5CF6'}
                height={48}
              />
            </div>
          )}

          {/* Change Indicator */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {change !== undefined && (
              <span className={`
                inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold
                ${change >= 0
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
                }
              `}>
                <TrendingUp className={`h-3 w-3 ${change < 0 ? 'rotate-180' : ''}`} />
                {change >= 0 ? '+' : ''}{change}%
              </span>
            )}
            {caption && (
              <span className="text-[11px] text-slate-500 font-medium">{caption}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ResponseSummary({ stats, sparklineData, isConnected }: { stats: SummaryStats; sparklineData?: number[]; isConnected?: boolean }) {
  const items: (MetricCardProps & { showLive?: boolean })[] = [
    {
      title: 'Total Responses',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100/80',
      gradient: 'from-blue-500 to-indigo-600',
      sparklineData: sparklineData,
      change: stats.weeklyChange,
      caption: 'vs last week',
      showLive: true,
    },
    {
      title: 'Verified Emails',
      value: stats.withEmail,
      icon: Mail,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100/80',
      gradient: 'from-emerald-500 to-teal-600',
      change: stats.total > 0 ? Math.round((stats.withEmail / stats.total) * 100) : 0,
      caption: 'of total',
    },
    {
      title: 'Anonymous',
      value: stats.anonymous,
      icon: ShieldOff,
      color: 'text-amber-600',
      bg: 'bg-amber-100/80',
      gradient: 'from-amber-500 to-orange-600',
      change: stats.total > 0 ? Math.round((stats.anonymous / stats.total) * 100) : 0,
      caption: 'of total',
    },
    {
      title: 'This Week',
      value: sparklineData ? sparklineData.slice(-7).reduce((a, b) => a + b, 0) : 0,
      icon: TrendingUp,
      color: 'text-violet-600',
      bg: 'bg-violet-100/80',
      gradient: 'from-violet-500 to-purple-600',
      sparklineData: sparklineData?.slice(-7),
      caption: 'responses',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {items.map((item) => (
        <MetricCard
          key={item.title}
          {...item}
          isLive={item.showLive && isConnected}
        />
      ))}
    </div>
  );
}

// ================================================================
// 6. TABLE VIEW (DESKTOP/TABLET)
// ================================================================
function ResponseTable({
  responses,
  questions,
  formCollectsEmail,
  loading,
  onDelete,
}: {
  responses: FormResponseWithAnswers[];
  questions: Question[];
  formCollectsEmail: boolean | null;
  loading: boolean;
  onDelete?: (responseId: string) => void;
}) {
  return (
    <div className="relative overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      <Table role="table" aria-busy={loading ? 'true' : 'false'}>
        <TableHeader className="bg-[#F8FAFC] sticky top-0 z-10">
          <TableRow className="hover:bg-[#F8FAFC] border-b border-slate-200">
            <TableHead className="w-[180px] font-semibold text-slate-600 text-xs uppercase tracking-wider pl-6 py-4">Submission Date</TableHead>
            {formCollectsEmail && <TableHead className="w-[240px] font-semibold text-slate-600 text-xs uppercase tracking-wider py-4">Respondent</TableHead>}
            {questions.map((q) => (
              <TableHead key={q.id} className="min-w-[200px] font-semibold text-slate-600 text-xs uppercase tracking-wider py-4">
                <div className="flex items-center gap-2 truncate" title={q.title}>
                  {q.title}
                </div>
              </TableHead>
            ))}
            {onDelete && <TableHead className="w-[80px] font-semibold text-slate-600 text-xs uppercase tracking-wider py-4 text-center">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={questions.length + (formCollectsEmail ? 2 : 1)} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <Search className="h-8 w-8 mb-2 opacity-20" />
                  <p>No results found for your search.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            responses.map((response) => (
              <TableRow
                key={response.id}
                className="hover:bg-slate-50/80 transition-colors duration-150 group cursor-default border-b border-slate-100"
                tabIndex={0}
              >
                <TableCell className="pl-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700 text-sm">
                      {new Date(response.submitted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(response.submitted_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </TableCell>
                {formCollectsEmail && (
                  <TableCell className="py-4">
                    {response.respondent_email ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold uppercase ring-2 ring-white">
                          {response.respondent_email.substring(0, 2)}
                        </div>
                        <div className="flex flex-col max-w-[180px]">
                          <span className="text-sm font-medium text-slate-900 truncate" title={response.respondent_email}>
                            {response.respondent_email}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="font-normal bg-slate-100 text-slate-500">Anonymous</Badge>
                    )}
                  </TableCell>
                )}
                {questions.map((q) => {
                  const answerText = formatAnswerForExport(q, response.answers[q.id]);
                  const display = formatAnswerForDisplay(q, response.answers[q.id]);
                  return (
                    <TableCell key={q.id} className="py-4">
                      <div className="max-w-[240px] truncate text-sm text-slate-600" title={answerText}>
                        {display}
                      </div>
                    </TableCell>
                  );
                })}
                {onDelete && (
                  <TableCell className="py-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(response.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete response"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ================================================================
// 7. CARD LIST (MOBILE)
// ================================================================
function ResponseCardList({
  responses,
  questions,
  onDelete,
}: {
  responses: FormResponseWithAnswers[];
  questions: Question[];
  onDelete?: (responseId: string) => void;
}) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 text-center">No responses found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {responses.map((response, index) => {
        const isExpanded = expandedCards.has(response.id);
        const previewQuestions = questions.slice(0, 2);
        const remainingCount = questions.length - 2;

        return (
          <motion.div
            key={response.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
          >
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              {/* Card Header */}
              <div
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white cursor-pointer"
                onClick={() => toggleCard(response.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Avatar */}
                  {response.respondent_email ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center text-sm font-bold uppercase flex-shrink-0 shadow-md">
                      {response.respondent_email.substring(0, 2)}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <ShieldOff className="w-4 h-4 text-slate-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate text-sm">
                      {response.respondent_email || 'Anonymous'}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {new Date(response.submitted_at).toLocaleDateString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); onDelete(response.id); }}
                      className="h-9 w-9 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <div className={`
                    w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center
                    transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}
                  `}>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Preview (always visible) */}
              <div className="px-4 pb-3 space-y-2.5">
                {previewQuestions.map((q) => (
                  <div key={q.id} className="flex gap-3">
                    <div className="w-1 bg-violet-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-500 truncate">{q.title}</p>
                      <p className="text-sm text-slate-800 line-clamp-1">
                        {formatAnswerForDisplay(q, response.answers[q.id])}
                      </p>
                    </div>
                  </div>
                ))}

                {!isExpanded && remainingCount > 0 && (
                  <p className="text-xs text-violet-600 font-medium pl-4">
                    +{remainingCount} more {remainingCount === 1 ? 'answer' : 'answers'}
                  </p>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-100"
                >
                  <div className="px-4 py-3 space-y-3 bg-slate-50/50">
                    {questions.slice(2).map((q) => (
                      <div key={q.id} className="flex gap-3">
                        <div className="w-1 bg-slate-200 rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-500 truncate">{q.title}</p>
                          <p className="text-sm text-slate-800">
                            {formatAnswerForDisplay(q, response.answers[q.id])}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ================================================================
// 8. MAIN
// ================================================================
export default function FormResponsesFinal() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [form, setForm] = useState<Tables<'forms'> | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [allResponses, setAllResponses] = useState<FormResponseWithAnswers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // local controlled search input to avoid triggering the data loader on every keystroke
  const [localQuery, setLocalQuery] = useState<string>(() => searchParams.get('q') || '');

  // Pagination & filtering
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('size') || 10);
  const query = searchParams.get('q')?.trim().toLowerCase() || '';

  // Filters
  const [dateFilter, setDateFilter] = useState('all'); // all, 7d, 30d
  const [typeFilter, setTypeFilter] = useState('all'); // all, email, anonymous

  // Reset page when filters change
  useEffect(() => {
    const next = new URLSearchParams(window.location.search);
    next.set('page', '1');
    setSearchParams(next, { replace: true });
  }, [localQuery, dateFilter, typeFilter, setSearchParams]);

  // Responsive mode
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Reduced motion
  const prefersReduced = useReducedMotion();

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isChartConfigModalOpen, setIsChartConfigModalOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<string | null>(null);

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle enterprise export (modal-based)
  const handleEnterpriseExport = useCallback(async (config: ExportConfig) => {
    console.log('[Export] Config:', config);

    try {
      // Get selected fields info
      const selectedFieldsInfo = questions
        .filter(q => config.selectedFields.includes(q.id))
        .map(q => ({ id: q.id, label: q.title }));

      if (config.format === 'csv' || config.format === 'xlsx') {
        // CSV/Excel export
        const exportData = allResponses.map(r => {
          const row: Record<string, any> = {
            'Submitted At': new Date(r.submitted_at).toLocaleString(),
            'Email': r.respondent_email || 'Anonymous',
          };
          selectedFieldsInfo.forEach(field => {
            const q = questions.find(q => q.id === field.id);
            if (q) {
              row[field.label] = formatAnswerForDisplay(q, r.answers[q.id]);
            }
          });
          return row;
        });

        const csv = Papa.unparse(exportData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${form?.title || 'form'}_responses.csv`;
        link.click();

        toast({ title: '✅ Export Complete', description: 'CSV file downloaded successfully.' });
      } else {
        // Enterprise PDF export using utility
        const { generatePDFReport, downloadPDF, captureAllCharts } = await import('@/utils/pdfExport');

        toast({ title: '📄 Capturing charts...', description: 'Please wait while we prepare your report.' });

        // Capture charts if requested
        let chartImages = {};
        if (config.includeCharts) {
          try {
            chartImages = await captureAllCharts();
            console.log('[Export] Charts captured:', Object.keys(chartImages).length);
          } catch (e) {
            console.warn('[Export] Failed to capture charts:', e);
          }
        }

        // Build responses for export
        const responsesForExport = allResponses.map(r => ({
          submittedAt: r.submitted_at,
          email: r.respondent_email,
          answers: r.answers,
        }));

        // Build insights
        const insights = config.includeInsights ? [
          `Response rate: ${allResponses.length} total submissions`,
          `Verified emails: ${allResponses.filter(r => r.respondent_email).length} (${Math.round(allResponses.filter(r => r.respondent_email).length / allResponses.length * 100) || 0}%)`,
          `Average submissions per day: ${(allResponses.length / 14).toFixed(1)}`,
          `Most active day: ${getMostActiveDay(allResponses)}`,
        ] : [];

        toast({ title: '📄 Generating PDF...', description: 'This may take a few seconds.' });

        const pdfBlob = await generatePDFReport({
          formTitle: form?.title || 'Form Responses',
          exportDate: new Date(),
          dateRange: config.dateRange === 'all' ? undefined : {
            start: new Date(Date.now() - parseInt(config.dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
          },
          includeCharts: config.includeCharts,
          includeResponses: config.exportType !== 'charts',
          includeInsights: config.includeInsights,
          includeMetadata: config.includeStats,
          selectedFields: selectedFieldsInfo,
          responses: responsesForExport,
          stats: {
            total: allResponses.length,
            verified: allResponses.filter(r => r.respondent_email).length,
            anonymous: allResponses.filter(r => !r.respondent_email).length,
          },
          insights,
          chartImages,
        });

        downloadPDF(pdfBlob, `${form?.title || 'form'}_report.pdf`);
        toast({ title: '✅ Export Complete', description: 'PDF report with watermark downloaded successfully.' });
      }
    } catch (err) {
      console.error('[Export] Error:', err);
      toast({ title: 'Export Failed', description: 'Could not generate export.', variant: 'destructive' });
    }
  }, [allResponses, questions, form]);

  // Helper to get most active day
  function getMostActiveDay(responses: FormResponseWithAnswers[]): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = new Array(7).fill(0);
    responses.forEach(r => {
      const dayIndex = new Date(r.submitted_at).getDay();
      counts[dayIndex]++;
    });
    const maxIndex = counts.indexOf(Math.max(...counts));
    return days[maxIndex];
  }

  // Handle opening delete confirmation dialog
  const openDeleteDialog = (responseId: string) => {
    setResponseToDelete(responseId);
    setDeleteDialogOpen(true);
  };

  // Handle response deletion
  const handleDeleteResponse = async () => {
    if (!responseToDelete) return;

    setIsDeleting(true);
    try {
      // Call the RPC function for transactional deletion
      const { error } = await (supabase as any).rpc('delete_form_response', {
        p_response_id: responseToDelete
      });

      if (error) throw error;

      // Optimistically remove from UI
      setAllResponses(prev => prev.filter(r => r.id !== responseToDelete));
      // No need to update 'responses' locally as it is derived

      toast({
        title: '✓ Response Deleted',
        description: 'The response has been permanently removed.',
      });

      setDeleteDialogOpen(false);
      setResponseToDelete(null);
    } catch (err: any) {
      console.error('[Delete] Error:', err);
      toast({
        title: 'Delete Failed',
        description: err?.message || 'Could not delete response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle new response from realtime subscription
  const handleNewResponse = useCallback(async (newResponse: Tables<'form_responses'>) => {
    console.log('[Realtime] Processing new response:', newResponse.id);

    // Show immediate toast notification
    toast({
      title: '🔔 New Response!',
      description: newResponse.respondent_email
        ? `From ${newResponse.respondent_email}`
        : 'Anonymous submission received',
      duration: 5000,
    });

    try {
      // Fetch the actual answers for this response
      const { data: qaData, error: qaError } = await supabase
        .from('question_responses')
        .select('*')
        .eq('form_response_id', newResponse.id);

      if (qaError) {
        console.error('[Realtime] Error fetching answers:', qaError);
      }

      // Build answers object
      const answers: Record<string, any> = {};
      if (qaData) {
        qaData.forEach((qr) => {
          answers[qr.question_id] = qr.answer;
        });
      }

      console.log('[Realtime] Fetched answers:', Object.keys(answers).length, 'answers');

      // Build the complete response with answers
      const responseWithAnswers: FormResponseWithAnswers = {
        ...newResponse,
        answers,
      };

      // Update allResponses (for analytics)
      setAllResponses(prev => [responseWithAnswers, ...prev]);

      // No need for manual pagination update, derived state handles it
    } catch (err) {
      console.error('[Realtime] Error processing new response:', err);
    }
  }, [page, pageSize]);

  // Realtime analytics subscription
  const realtimeAnalytics = useRealtimeAnalytics({
    formId: id || '',
    enabled: !!id && !isLoading,
    onNewResponse: handleNewResponse,
  });

  // build search params from current location so we don't depend on a changing `searchParams` object
  const setPage = useCallback((p: number) => {
    const next = new URLSearchParams(window.location.search);
    next.set('page', String(Math.max(1, p)));
    setSearchParams(next, { replace: false });
  }, [setSearchParams]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      try {
        // Fetch form and questions in parallel
        const [formResult, questionsResult] = await Promise.all([
          supabase.from('forms').select('*').eq('id', id).single(),
          supabase.from('questions').select('*').eq('form_id', id).order('order_index'),
        ]);

        if (formResult.error) throw new Error("Form not found or you don't have permission.");
        if (!isMounted) return;
        setForm(formResult.data);

        if (questionsResult.error) throw questionsResult.error;
        if (!isMounted) return;
        setQuestions(questionsResult.data || []);

        // Fetch ALL responses for analytics (no pagination)
        const { data: allResponsesData, error: allResponsesError } = await supabase
          .from('form_responses')
          .select('*')
          .eq('form_id', id)
          .order('submitted_at', { ascending: false });

        if (allResponsesError) throw allResponsesError;

        if (!allResponsesData || allResponsesData.length === 0) {
          if (!isMounted) return;
          setAllResponses([]);
          setIsLoading(false);
          return;
        }

        // Fetch all question answers
        const responseIds = allResponsesData.map((r) => r.id);
        const { data: qaData, error: qaError } = await supabase
          .from('question_responses')
          .select('*')
          .in('form_response_id', responseIds);

        if (qaError) throw qaError;

        const answersByResponseId = qaData.reduce<Record<string, Record<string, any>>>((acc, qr) => {
          if (!acc[qr.form_response_id]) acc[qr.form_response_id] = {};
          acc[qr.form_response_id][qr.question_id] = qr.answer;
          return acc;
        }, {});

        const combined = allResponsesData.map((res) => ({
          ...res,
          answers: answersByResponseId[res.id] || {},
        }));

        if (!isMounted) return;
        setAllResponses(combined);

      } catch (err: any) {
        console.error('Error loading form data:', err);
        if (!isMounted) return;
        setError(err.message || 'Failed to load form responses.');
        toast({
          title: 'Error',
          description: err.message || 'Failed to load form responses.',
          variant: 'destructive',
        });
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    if (user && id) {
      load();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user, id, page, pageSize, setPage]);

  // Debounce syncing the local input value to the URL q param.
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(window.location.search);
      if (localQuery) {
        next.set('q', localQuery);
      } else {
        next.delete('q');
      }
      // when search is changed, reset to first page
      next.set('page', '1');
      setSearchParams(next, { replace: false });
    }, 400);
    return () => clearTimeout(t);
  }, [localQuery, setSearchParams]);

  // derive the filtered responses (so typing doesn't reload)
  const filteredResponses = useMemo(() => {
    let filtered = allResponses;

    // 1. Text Search
    const q = (localQuery || '').trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((res) => {
        const emailHit = (res.respondent_email || '').toLowerCase().includes(q);
        const answersHit = questions.some((question) => {
          const val = formatAnswerForExport(question, res.answers[question.id]);
          return val.toLowerCase().includes(q);
        });
        return emailHit || answersHit;
      });
    }

    // 2. Date Filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (dateFilter === '7d') cutoff.setDate(now.getDate() - 7);
      if (dateFilter === '30d') cutoff.setDate(now.getDate() - 30);

      filtered = filtered.filter(res => new Date(res.submitted_at) >= cutoff);
    }

    // 3. Type Filter
    if (typeFilter !== 'all') {
      if (typeFilter === 'email') filtered = filtered.filter(res => !!res.respondent_email);
      if (typeFilter === 'anonymous') filtered = filtered.filter(res => !res.respondent_email);
    }

    return filtered;
  }, [allResponses, localQuery, questions, dateFilter, typeFilter]);

  // Apply pagination to filtered results
  const displayedResponses = useMemo(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return filteredResponses.slice(from, to);
  }, [filteredResponses, page, pageSize]);

  // Pagination stats
  const totalPages = Math.ceil(filteredResponses.length / pageSize);

  // Stats for analytics
  const stats = useMemo<SummaryStats>(() => {
    const withEmail = allResponses.filter((r) => !!r.respondent_email).length;

    // Calculate weekly change
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = allResponses.filter(r => new Date(r.submitted_at) >= oneWeekAgo).length;
    const lastWeek = allResponses.filter(r => {
      const date = new Date(r.submitted_at);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).length;

    const weeklyChange = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

    return {
      total: allResponses.length,
      withEmail,
      anonymous: allResponses.length - withEmail,
      weeklyChange,
    };
  }, [allResponses]);

  // Sparkline data (last 14 days)
  const sparklineData = useMemo(() => {
    const data: number[] = [];
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const count = allResponses.filter(r =>
        r.submitted_at.startsWith(dateStr)
      ).length;

      data.push(count);
    }

    return data;
  }, [allResponses]);

  // Chart data
  const lineChartData = useMemo(() => {
    const grouped: Record<string, number> = {};

    allResponses.forEach(r => {
      const date = new Date(r.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped)
      .slice(-14)
      .map(([date, count]) => ({ date, count }));
  }, [allResponses]);

  const barChartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);

    allResponses.forEach(r => {
      const dayIndex = new Date(r.submitted_at).getDay();
      counts[dayIndex]++;
    });

    return days.map((day, i) => ({ day, count: counts[i] }));
  }, [allResponses]);

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!form) return;
    const headers = [
      'Submission Date',
      ...(form.collect_email ? ['Email'] : []),
      ...questions.map((q) => q.title),
    ];
    // export the currently displayed (filtered) responses
    const data = displayedResponses.map((res) => [
      new Date(res.submitted_at).toLocaleString(),
      ...(form.collect_email ? [res.respondent_email || 'Anonymous'] : []),
      ...questions.map((q) => formatAnswerForExport(q, res.answers[q.id])),
    ]);
    const filename = `${form.title.replace(/\s+/g, '_')}_Responses`;

    if (format === 'csv') {
      const csv = Papa.unparse({ fields: headers, data });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    if (format === 'pdf') {
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.text(`${form.title} - Responses`, 14, 16);
      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 22,
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { fontSize: 8 },
      });
      doc.save(`${filename}.pdf`);
    }
    toast({
      title: 'Export Started',
      description: `Your ${format.toUpperCase()} file is downloading.`,
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Link Copied',
        description: 'Dashboard link has been copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Share',
        description: url,
      });
    }
  };

  if (isLoading) return <FormResponsesSkeleton />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
        <XCircle className="w-16 h-16 mx-auto text-red-500" aria-hidden="true" />
        <h1 className="mt-6 text-2xl font-bold text-slate-800">Authentication Required</h1>
        <p className="mt-2 text-slate-600">Please sign in to view this page.</p>
        <Button asChild className="mt-8">
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 text-center">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <XCircle className="w-16 h-16 mx-auto text-red-500" aria-hidden="true" />
          <h1 className="mt-6 text-2xl font-bold text-slate-800">
            {error ? 'An Error Occurred' : 'Form Not Found'}
          </h1>
          <p className="mt-2 text-slate-600">
            {error || "This form may have been deleted or you don't have permission to view it."}
          </p>
        </motion.div>
      </div>
    );
  }

  const hasResults = displayedResponses.length > 0;

  return (
    <MotionConfig reducedMotion={prefersReduced ? 'user' : undefined}>
      <div className="min-h-screen bg-white">

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* PAGE HEADER */}
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
              <div>
                <div className="flex items-center text-sm text-slate-500 mb-2">
                  <Link to="/dashboard" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                  </Link>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{form.title}</h1>
                <div className="flex items-center gap-3">
                  <p className="text-slate-500 text-lg">Response Analytics</p>
                  {/* Realtime Connection Status */}
                  <div className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                    ${realtimeAnalytics.isConnected
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50'
                      : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/50'
                    }
                  `}>
                    {realtimeAnalytics.isConnected ? (
                      <><Wifi className="h-3 w-3" /> Live</>
                    ) : (
                      <><WifiOff className="h-3 w-3" /> Connecting...</>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" className="h-10 border-slate-200 hover:bg-slate-50" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2 text-slate-500" />
                  Share
                </Button>
                <Button asChild variant="outline" className="h-10 border-slate-200 hover:bg-slate-50">
                  <Link to={`/forms/${id}/view`} target="_blank">
                    <Eye className="w-4 h-4 mr-2 text-slate-500" />
                    View Live Form
                  </Link>
                </Button>
              </div>
            </div>

            {/* METRIC CARDS */}
            <ResponseSummary stats={stats} sparklineData={sparklineData} isConnected={realtimeAnalytics.isConnected} />
          </motion.div>

          {/* ANALYTICS CHARTS */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8"
          >
            <ResponsesLineChart data={lineChartData} loading={isLoading} />
            <DistributionBarChart data={barChartData} loading={isLoading} />
            <TypeBreakdownChart verified={stats.withEmail} anonymous={stats.anonymous} loading={isLoading} />
          </motion.div>

          {/* INSIGHTS PANEL */}
          <InsightsSummary
            totalResponses={stats.total}
            verifiedCount={stats.withEmail}
            anonymousCount={stats.anonymous}
            weeklyChange={stats.weeklyChange}
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* TOOLBAR */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden mb-4">
              {/* Header Bar */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200/50">
                    <List className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">All Responses</h2>
                    <p className="text-xs text-slate-500">{displayedResponses.length} of {allResponses.length} shown</p>
                  </div>
                </div>

                {/* Desktop Export */}
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare} className="h-9 border-slate-200">
                    <Share2 className="h-4 w-4 mr-1.5" />
                    Share
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="h-9 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-md shadow-violet-200/50">
                        <Download className="h-4 w-4 mr-1.5" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setIsExportModalOpen(true)} className="text-sm font-medium">
                        <FileText className="h-4 w-4 mr-2 text-violet-600" />
                        Export Wizard...
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport('csv')} className="text-sm">
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                        Quick Export CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport('pdf')} className="text-sm">
                        <FileText className="h-4 w-4 mr-2 text-red-600" />
                        Quick Export PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="p-4 space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by email or response..."
                    className="pl-10 h-11 border-slate-200 bg-slate-50 focus:bg-white rounded-xl text-sm shadow-sm"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="h-9 w-auto min-w-[120px] text-xs font-medium border-slate-200 bg-white rounded-full px-4 shadow-sm">
                      <Calendar className="mr-2 h-3.5 w-3.5 text-violet-500" />
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-9 w-auto min-w-[120px] text-xs font-medium border-slate-200 bg-white rounded-full px-4 shadow-sm">
                      <Users className="mr-2 h-3.5 w-3.5 text-violet-500" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="email">With Email</SelectItem>
                      <SelectItem value="anonymous">Anonymous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile Export */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className="w-full h-11 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl shadow-md">
                        <Download className="h-4 w-4 mr-2" />
                        Export Responses
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56">
                      <DropdownMenuItem onClick={() => setIsExportModalOpen(true)} className="text-sm font-medium">
                        <FileText className="h-4 w-4 mr-2 text-violet-600" />
                        Export Wizard...
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport('csv')} className="text-sm">
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                        Quick Export CSV
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport('pdf')} className="text-sm">
                        <FileText className="h-4 w-4 mr-2 text-red-600" />
                        Quick Export PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* TABLE */}
            {isMobile ? (
              <ResponseCardList responses={displayedResponses} questions={questions} onDelete={openDeleteDialog} />
            ) : (
              <ResponseTable
                responses={displayedResponses}
                questions={questions}
                formCollectsEmail={form.collect_email}
                loading={isLoading}
                onDelete={openDeleteDialog}
              />
            )}

            {/* ENHANCED PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-200/80 rounded-2xl">
              <p className="text-sm text-slate-600">
                Showing <span className="font-bold text-slate-900">{((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, filteredResponses.length)}</span> of{" "}
                <span className="font-bold text-slate-900">{filteredResponses.length}</span> responses
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-xl border-slate-200 disabled:opacity-40"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <div className="flex items-center gap-1 px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-sm font-bold text-violet-600">{page}</span>
                  <span className="text-sm text-slate-400">/</span>
                  <span className="text-sm font-medium text-slate-600">{totalPages || 1}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 rounded-xl border-slate-200 disabled:opacity-40"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleEnterpriseExport}
        totalResponses={allResponses.length}
        chartCount={3}
        fields={questions.map(q => ({ id: q.id, label: q.title }))}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setResponseToDelete(null);
        }}
        onConfirm={handleDeleteResponse}
        isDeleting={isDeleting}
        title="Delete Response"
        description="This action cannot be undone. This will permanently delete the selected response and all associated answer data."
      />
    </MotionConfig>
  );
}
