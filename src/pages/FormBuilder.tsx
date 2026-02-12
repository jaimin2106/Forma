import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Eye, Save, ArrowLeft, Layers, Settings, MessageSquare, ExternalLink
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FormShare } from '@/components/FormShare';
import FormSettings from '@/components/FormSettings';
import QuestionsBuilder from '@/components/QuestionsBuilder';
import type { Tables, Enums } from '@/integrations/supabase/types';
import { motion, AnimatePresence } from 'framer-motion';

type Form = Tables<'forms'>;
type Question = Tables<'questions'>;
type QuestionType = Enums<'question_type'>;

// Tab type definition
type WorkspaceTab = 'builder' | 'preview' | 'responses' | 'settings';

// Helper function to format relative time
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

interface FormData {
  title: string;
  description: string;
  allow_anonymous: boolean;
  collect_email: boolean;
  is_quiz: boolean;
  time_limit_minutes?: number;
  passing_score?: number;
  show_results: boolean;
  allow_retake: boolean;
  auto_save_enabled: boolean;
  custom_thank_you_message?: string;
  passing_feedback?: string;
  failing_feedback?: string;
  use_percentage_criteria: boolean;
  use_mcq_criteria: boolean;
  min_correct_mcqs?: number;
  total_mcqs?: number;
}

interface QuestionData {
  id?: string;
  type: QuestionType;
  title: string;
  description: string;
  required: boolean;
  options?: string[];
  order_index: number;
  points?: number;
  correct_answers?: string[];
  explanation?: string;
}

// Workspace Tab Configuration
const WORKSPACE_TABS: { id: WorkspaceTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'builder', label: 'Builder', icon: Layers },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'responses', label: 'Responses', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('builder');

  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    allow_anonymous: true,
    collect_email: false,
    is_quiz: false,
    show_results: true,
    allow_retake: true,
    auto_save_enabled: true,
    use_percentage_criteria: true,
    use_mcq_criteria: false,
  });
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingForm, setLoadingForm] = useState(!!id);
  const [isPublished, setIsPublished] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>();
  const [savedFormId, setSavedFormId] = useState<string | null>(null);

  // Analytics state
  const [responseCount, setResponseCount] = useState(0);

  const totalMcqs = questions.filter(q =>
    ['multiple_choice', 'checkbox', 'dropdown'].includes(q.type)
  ).length;

  useEffect(() => {
    setForm(prev => ({ ...prev, total_mcqs: totalMcqs }));
  }, [totalMcqs]);

  useEffect(() => {
    if (user && id) {
      loadForm();
      loadResponseCount();
    } else if (user && !id) {
      const templateParam = searchParams.get('template');
      if (templateParam) {
        try {
          const template = JSON.parse(decodeURIComponent(templateParam));
          loadTemplate(template);
        } catch (error) {
          console.error('Error parsing template:', error);
        }
      }
    }
  }, [user, id, searchParams]);

  const loadResponseCount = async () => {
    if (!id) return;
    try {
      const { count } = await supabase
        .from('form_responses')
        .select('*', { count: 'exact', head: true })
        .eq('form_id', id);
      setResponseCount(count || 0);
    } catch (error) {
      console.error('Error loading response count:', error);
    }
  };

  const loadTemplate = (template: any) => {
    setForm({
      title: template.form.title,
      description: template.form.description,
      allow_anonymous: template.form.allow_anonymous,
      collect_email: template.form.collect_email,
      is_quiz: template.form.is_quiz || false,
      show_results: template.form.show_results ?? true,
      allow_retake: template.form.allow_retake ?? true,
      auto_save_enabled: template.form.auto_save_enabled ?? true,
      time_limit_minutes: template.form.time_limit_minutes,
      passing_score: template.form.passing_score,
      use_percentage_criteria: template.form.use_percentage_criteria ?? true,
      use_mcq_criteria: template.form.use_mcq_criteria ?? false,
      min_correct_mcqs: template.form.min_correct_mcqs,
      total_mcqs: template.form.total_mcqs,
    });
    const templateQuestions = template.questions.map((q: any, index: number) => ({
      type: q.type,
      title: q.title,
      description: q.description,
      required: q.required,
      options: q.options || [],
      order_index: index,
      points: q.points || (template.form.is_quiz ? 1 : undefined),
      correct_answers: q.correct_answers || [],
      explanation: q.explanation || '',
    }));
    setQuestions(templateQuestions);
    toast({ title: "Template Loaded", description: `${template.name} template applied.` });
  };

  const loadForm = async () => {
    if (!id) return;
    try {
      const { data: formData, error: formError } = await supabase.from('forms').select('*').eq('id', id).single();
      if (formError) throw formError;
      if (formData.user_id !== user!.id) throw new Error("Permission denied.");

      setForm({
        title: formData.title,
        description: formData.description || '',
        allow_anonymous: formData.allow_anonymous,
        collect_email: formData.collect_email,
        is_quiz: formData.is_quiz || false,
        time_limit_minutes: formData.time_limit_minutes || undefined,
        passing_score: formData.passing_score || undefined,
        show_results: formData.show_results ?? true,
        allow_retake: formData.allow_retake ?? true,
        auto_save_enabled: formData.auto_save_enabled ?? true,
        custom_thank_you_message: formData.custom_thank_you_message || undefined,
        use_percentage_criteria: formData.use_percentage_criteria ?? true,
        use_mcq_criteria: formData.use_mcq_criteria ?? false,
        min_correct_mcqs: formData.min_correct_mcqs || undefined,
        total_mcqs: formData.total_mcqs || undefined,
      });
      setIsPublished(formData.status === 'published');
      const { data: questionsData, error: questionsError } = await supabase.from('questions').select('*').eq('form_id', id).order('order_index');
      if (questionsError) throw questionsError;
      setQuestions(questionsData.map(q => ({
        id: q.id,
        type: q.type,
        title: q.title,
        description: q.description || '',
        required: q.required,
        options: q.options as string[] || [],
        order_index: q.order_index,
        points: q.points || undefined,
        correct_answers: q.correct_answers as string[] || [],
        explanation: q.explanation || '',
      })));
    } catch (error) {
      console.error('Error loading form:', error);
      toast({ title: "Error", description: "Failed to load form.", variant: "destructive" });
    } finally {
      setLoadingForm(false);
    }
  };

  const saveForm = async (): Promise<string | null> => {
    if (!form.title.trim()) {
      toast({ title: "Validation Error", description: "Form title is required.", variant: "destructive" });
      return null;
    }
    setSaving(true);
    try {
      let formId = id;
      const totalPoints = form.is_quiz ? questions.reduce((sum, q) => sum + (q.points || 1), 0) : 0;
      const formUpdateData = {
        title: form.title,
        description: form.description,
        allow_anonymous: form.allow_anonymous,
        collect_email: form.collect_email,
        is_quiz: form.is_quiz,
        time_limit_minutes: form.time_limit_minutes,
        passing_score: form.passing_score,
        total_points: totalPoints,
        show_results: form.show_results,
        allow_retake: form.allow_retake,
        auto_save_enabled: form.auto_save_enabled,
        custom_thank_you_message: form.custom_thank_you_message,
        use_percentage_criteria: form.use_percentage_criteria,
        use_mcq_criteria: form.use_mcq_criteria,
        min_correct_mcqs: form.min_correct_mcqs,
        total_mcqs: totalMcqs,
      };

      if (id) {
        const { error: formError } = await supabase.from('forms').update(formUpdateData).eq('id', id);
        if (formError) throw formError;
      } else {
        const { data: newForm, error: formError } = await supabase.from('forms').insert({ ...formUpdateData, user_id: user!.id }).select().single();
        if (formError) throw formError;
        formId = newForm.id;
      }

      if (id) await supabase.from('questions').delete().eq('form_id', id);

      if (questions.length > 0) {
        const questionsToInsert = questions.map(q => ({
          form_id: formId,
          type: q.type,
          title: q.title,
          description: q.description,
          required: q.required,
          options: q.options?.length ? q.options : null,
          order_index: q.order_index,
          points: form.is_quiz ? (q.points || 1) : null,
          correct_answers: form.is_quiz && q.correct_answers?.length ? q.correct_answers : null,
          explanation: form.is_quiz ? q.explanation : null,
        }));
        const { error: questionsError } = await supabase.from('questions').insert(questionsToInsert);
        if (questionsError) throw questionsError;
      }

      setLastSaved(new Date());
      toast({ title: "Saved", description: "Changes saved successfully." });
      if (!id) navigate(`/forms/${formId}/edit`);
      setSavedFormId(formId as string);
      return formId as string;
    } catch (error) {
      console.error('Error saving form:', error);
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const publishForm = async () => {
    let formId = id;
    if (!formId) {
      const savedId = await saveForm();
      if (!savedId) return;
      formId = savedId;
    }
    try {
      const { error } = await supabase.from('forms').update({ status: 'published' }).eq('id', formId);
      if (error) throw error;
      setIsPublished(true);
      toast({ title: "Published", description: "Your form is now live." });
    } catch (err) {
      console.error('Error publishing form:', err);
      toast({ title: "Error", description: "Failed to publish.", variant: "destructive" });
    }
  };

  const formId = id || savedFormId;

  if (loading || loadingForm) return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50">
      <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ====== TOP HEADER BAR ====== */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 h-14 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-slate-100 rounded-lg h-9 w-9"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </Button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          <div className="flex flex-col gap-0 min-w-0">
            <h1 className="text-sm font-semibold text-slate-900 leading-tight truncate max-w-[140px] sm:max-w-[200px] md:max-w-none">
              {form.title || 'Untitled Form'}
            </h1>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              <span className="text-[10px] text-slate-500">
                {isPublished ? 'Live' : 'Draft'}
              </span>
              <span className="text-slate-300 text-[10px]">•</span>
              <span className={`text-[10px] ${saving ? 'text-slate-400' : lastSaved ? 'text-slate-500' : 'text-amber-600'}`}>
                {saving ? 'Saving...' : lastSaved ? `Saved ${getRelativeTime(lastSaved)}` : 'Unsaved'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save button - visible on all screen sizes */}
          <Button
            onClick={() => saveForm()}
            variant="ghost"
            size="sm"
            disabled={saving}
            className="text-slate-600 font-medium hover:bg-slate-100 h-9 px-2 sm:px-3 rounded-lg"
          >
            <Save className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          <Button
            onClick={publishForm}
            disabled={saving || isPublished}
            size="sm"
            className={`font-semibold h-8 px-4 rounded-lg transition-all ${isPublished
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
          >
            {isPublished ? 'Published' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* ====== DESKTOP WORKSPACE NAVIGATION - Sleek Top Bar ====== */}
      <nav className="hidden md:block sticky top-14 z-40 bg-gradient-to-b from-white to-slate-50/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-center">
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 shadow-inner">
            {WORKSPACE_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'
                    }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-slate-900' : ''}`} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabDesktop"
                      className="absolute inset-0 bg-white rounded-lg shadow-md -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ====== MOBILE BOTTOM NAVIGATION - Thumb-friendly ====== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl shadow-black/10 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {WORKSPACE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 transition-all duration-200 ${isActive
                  ? 'text-slate-900'
                  : 'text-slate-400 active:text-slate-600'
                  }`}
              >
                <div className={`relative p-2 rounded-xl transition-all duration-200 ${isActive ? 'bg-slate-900' : ''}`}>
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : ''}`} />
                  {isActive && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute inset-0 bg-slate-900 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-slate-900' : ''}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ====== WORKSPACE CONTENT ====== */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* BUILDER TAB */}
          {activeTab === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="py-6 md:py-8 pb-28 md:pb-8"
            >
              <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
                {/* Form Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Form Title"
                    className="w-full text-2xl md:text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:outline-none bg-transparent tracking-tight mb-2"
                  />
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Add a description..."
                    className="w-full text-base text-slate-500 placeholder:text-slate-300 border-none focus:outline-none bg-transparent"
                  />
                </div>

                <QuestionsBuilder
                  questions={questions}
                  onQuestionsChange={setQuestions}
                  isQuiz={form.is_quiz}
                  timeLimit={form.time_limit_minutes}
                />
              </div>
            </motion.div>
          )}

          {/* PREVIEW TAB - Embeds existing PublicForm page */}
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="h-[calc(100vh-7rem)] md:h-[calc(100vh-7rem)] pb-16 md:pb-0"
            >
              {formId ? (
                <div className="h-full flex flex-col">
                  {/* Preview Header Bar */}
                  <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">Live Preview</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/forms/${formId}/view`, '_blank')}
                      className="h-7 text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open in new tab
                    </Button>
                  </div>
                  {/* Iframe */}
                  <iframe
                    src={`/forms/${formId}/view?embed=true`}
                    className="flex-1 w-full border-0"
                    title="Form Preview"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <Eye className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">Save your form first</p>
                    <p className="text-sm mt-1">Preview will be available after saving</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* RESPONSES TAB - Embeds existing FormResponses page */}
          {activeTab === 'responses' && (
            <motion.div
              key="responses"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="h-[calc(100vh-7rem)] md:h-[calc(100vh-7rem)] pb-16 md:pb-0"
            >
              {formId ? (
                <iframe
                  src={`/forms/${formId}/responses?embed=true`}
                  className="w-full h-full border-0"
                  title="Form Responses"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p className="font-medium">Save your form first</p>
                    <p className="text-sm mt-1">Responses will appear here after saving</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="py-6 md:py-8 pb-28 md:pb-8"
            >
              <div className="max-w-2xl mx-auto px-4 md:px-6">
                <FormSettings
                  form={form}
                  onFormChange={setForm}
                  onSave={saveForm}
                  saving={saving}
                  lastSaved={lastSaved}
                  totalMcqs={totalMcqs}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/* Mobile Save FAB removed - Save is now in header */}
    </div>
  );
}
