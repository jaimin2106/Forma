import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, MotionConfig, useReducedMotion } from 'framer-motion';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

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
  Eye,
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-1/2 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className={`mt-8 rounded-xl ${TOKENS.panel} ${TOKENS.border} ${TOKENS.shadowSoft}`}>
        <div className="p-4 border-b border-slate-200/70">
          <Skeleton className="h-6 w-48 rounded-md" />
        </div>
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
  );
}

// ================================================================
// 5. SUMMARY
// ================================================================
function ResponseSummary({ stats }: { stats: SummaryStats }) {
  const items = [
    {
      title: 'Total Responses',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      caption: 'All time submissions'
    },
    {
      title: 'Verified Emails',
      value: stats.withEmail,
      icon: Mail,
      color: 'text-green-600',
      bg: 'bg-green-50',
      caption: 'Provided contact info'
    },
    {
      title: 'Anonymous',
      value: stats.anonymous,
      icon: ShieldOff,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      caption: 'No identification'
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
      {items.map((item) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className={`${TOKENS.panel} ${TOKENS.border} ${TOKENS.shadowHover} overflow-hidden group`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{item.title}</p>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">{item.value.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400 font-medium">
                {item.caption}
              </div>
            </CardContent>
          </Card>
        </motion.div>
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
}: {
  responses: FormResponseWithAnswers[];
  questions: Question[];
  formCollectsEmail: boolean | null;
  loading: boolean;
}) {
  return (
    <div className="relative overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
      <Table role="table" aria-busy={loading ? 'true' : 'false'}>
        <TableHeader className="bg-slate-50 sticky top-0 z-10">
          <TableRow className="hover:bg-slate-50 border-b border-slate-200">
            <TableHead className="w-[180px] font-semibold text-slate-700 pl-6 py-4">Submission Date</TableHead>
            {formCollectsEmail && <TableHead className="w-[240px] font-semibold text-slate-700 py-4">Respondent</TableHead>}
            {questions.map((q) => (
              <TableHead key={q.id} className="min-w-[200px] font-semibold text-slate-700 py-4">
                <div className="flex items-center gap-2 truncate" title={q.title}>
                  {q.title}
                </div>
              </TableHead>
            ))}
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
                className="hover:bg-slate-50/80 transition-colors duration-150 group cursor-default"
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
}: {
  responses: FormResponseWithAnswers[];
  questions: Question[];
}) {
  return (
    <div className="space-y-4 p-4 bg-slate-50/60">
      {responses.map((response, index) => (
        <motion.div
          key={response.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
        >
          <Card className={`overflow-hidden ${TOKENS.panel} ${TOKENS.border} ${TOKENS.shadowSoft}`}>
            <CardHeader className={`p-4 border-b border-slate-200 ${TOKENS.gradientHeader}`}>
              <div className="flex items-center justify-between">
                {response.respondent_email ? (
                  <div className="flex items-center text-sm font-medium text-slate-700">
                    <Mail className="w-4 h-4 mr-2 text-slate-500" aria-hidden="true" />
                    <span>{response.respondent_email}</span>
                  </div>
                ) : (
                  <Badge variant="secondary">Anonymous</Badge>
                )}
                <div className="flex items-center text-xs text-slate-500">
                  <Calendar className="w-3 h-3 mr-1.5" aria-hidden="true" />
                  {new Date(response.submitted_at).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {questions.map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-semibold text-slate-800 mb-1">{q.title}</p>
                  <p className="text-sm text-slate-600 pl-2 border-l-2 border-purple-200">
                    {formatAnswerForDisplay(q, response.answers[q.id])}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}
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
  const [responses, setResponses] = useState<FormResponseWithAnswers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // local controlled search input to avoid triggering the data loader on every keystroke
  const [localQuery, setLocalQuery] = useState<string>(() => searchParams.get('q') || '');

  // Pagination & filtering
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Number(searchParams.get('size') || 10);
  const query = searchParams.get('q')?.trim().toLowerCase() || '';

  // Responsive mode
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Reduced motion
  const prefersReduced = useReducedMotion();

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

        // Count total responses for pagination
        const { count, error: countError } = await supabase
          .from('form_responses')
          .select('*', { count: 'exact', head: true })
          .eq('form_id', id);

        if (countError) throw countError;

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        // Fetch page of responses
        const { data: responsesData, error: responsesError } = await supabase
          .from('form_responses')
          .select('*')
          .eq('form_id', id)
          .order('submitted_at', { ascending: false })
          .range(from, to);

        if (responsesError) throw responsesError;

        if (!responsesData || responsesData.length === 0) {
          if (!isMounted) return;
          setResponses([]);
          setIsLoading(false);
          return;
        }

        // Fetch all question answers for those responses
        const responseIds = responsesData.map((r) => r.id);
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

        const combined = responsesData.map((res) => ({
          ...res,
          answers: answersByResponseId[res.id] || {},
        }));

        // store the fetched page (we will apply client-side filtering separately)
        if (!isMounted) return;
        setResponses(combined);

        // If filtering reduces items and page has no items, reset page
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
  }, [user, id, page, pageSize, setPage, questions.length]);

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

  // derive the displayed responses by filtering client-side (so typing doesn't reload)
  // Filters
  const [dateFilter, setDateFilter] = useState('all'); // all, 7d, 30d
  const [typeFilter, setTypeFilter] = useState('all'); // all, email, anonymous

  // derive the displayed responses by filtering client-side (so typing doesn't reload)
  const displayedResponses = useMemo(() => {
    let filtered = responses;

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
  }, [responses, localQuery, questions, dateFilter, typeFilter]);

  const stats = useMemo<SummaryStats>(() => {
    const withEmail = displayedResponses.filter((r) => !!r.respondent_email).length;
    return {
      total: displayedResponses.length,
      withEmail,
      anonymous: displayedResponses.length - withEmail,
    };
  }, [responses]);

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
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 8 },
      });
      doc.save(`${filename}.pdf`);
    }
    toast({
      title: 'Export Started',
      description: `Your ${format.toUpperCase()} file is downloading.`,
    });
  };

  if (isLoading) return <FormResponsesSkeleton />;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <XCircle className="w-16 h-16 mx-auto text-red-500" aria-hidden="true" />
          <h1 className="mt-6 text-2xl font-bold text-slate-800">
            {error ? 'An Error Occurred' : 'Form Not Found'}
          </h1>
          <p className="mt-2 text-slate-600">
            {error || "This form may have been deleted or you don't have permission to view it."}
          </p>
          {/* Removed Back to Dashboard button */}
        </motion.div>
      </div>
    );
  }

  const totalCountApprox = stats.total; // local page count; server count could be added if needed
  const hasResults = displayedResponses.length > 0;

  return (
    <MotionConfig reducedMotion={prefersReduced ? 'user' : undefined}>
      <div className="min-h-screen bg-slate-50">

        {/* Header removed as it is empty */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
              <div>
                <div className="flex items-center text-sm text-slate-500 mb-2">
                  <Link to="/dashboard" className="hover:text-purple-600 transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Dashboard
                  </Link>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{form.title}</h1>
                <p className="text-slate-500 text-lg">Response Dashboard</p>
              </div>

              <div className="flex items-center gap-3">
                <Button asChild variant="outline" className="h-10 border-slate-200 hover:bg-slate-50">
                  <Link to={`/forms/${id}/view`} target="_blank">
                    <Eye className="w-4 h-4 mr-2 text-slate-500" />
                    View Live Form
                  </Link>
                </Button>
              </div>
            </div>

            <ResponseSummary stats={stats} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* TOOLBAR */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-2 rounded-xl mb-4">
              {/* Left: Title & Count */}
              <div className="flex items-center pl-2">
                <div className="bg-purple-100 text-purple-700 p-2 rounded-lg mr-3">
                  <List className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-tight">All Responses</h2>
                  <p className="text-xs text-slate-500">{displayedResponses.length} found</p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-2">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-9 h-9 border-slate-200 bg-slate-50/50 focus:bg-white transition-all text-sm"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                  />
                </div>

                <Separator orientation="vertical" className="h-6 hidden sm:block mx-1" />

                {/* Filters */}
                <div className="flex w-full sm:w-auto gap-2">
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="h-9 w-[130px] text-xs font-medium border-slate-200">
                      <Calendar className="mr-2 h-3.5 w-3.5 text-slate-500" />
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="h-9 w-[130px] text-xs font-medium border-slate-200">
                      <Users className="mr-2 h-3.5 w-3.5 text-slate-500" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="email">With Email</SelectItem>
                      <SelectItem value="anonymous">Anonymous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator orientation="vertical" className="h-6 hidden sm:block mx-1" />

                {/* Export */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm" className="h-9 w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 shadow-sm">
                      <Download className="h-3.5 w-3.5 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleExport('csv')} className="text-xs">
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-green-600" />
                      Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')} className="text-xs">
                      <FileText className="h-3.5 w-3.5 mr-2 text-red-600" />
                      Export PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* TABLE */}
            {isMobile ? (
              <ResponseCardList responses={displayedResponses} questions={questions} />
            ) : (
              <ResponseTable
                responses={displayedResponses}
                questions={questions}
                formCollectsEmail={form.collect_email}
                loading={isLoading}
              />
            )}

            {/* FOOTER PAGINATION */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="text-sm text-slate-500">
                Page <span className="font-medium text-slate-900">{page}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(page + 1)}
                  disabled={displayedResponses.length < pageSize && page > 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  );
}
