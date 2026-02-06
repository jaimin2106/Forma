import { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Share, Save, ArrowLeft, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FormShare } from '@/components/FormShare';
import FormSettings from '@/components/FormSettings';
import QuestionsBuilder from '@/components/QuestionsBuilder';
import type { Tables, Enums } from '@/integrations/supabase/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Form = Tables<'forms'>;
type Question = Tables<'questions'>;
type QuestionType = Enums<'question_type'>;

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

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("builder");

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

  const totalMcqs = questions.filter(q =>
    ['multiple_choice', 'checkbox', 'dropdown'].includes(q.type)
  ).length;

  useEffect(() => {
    setForm(prev => ({ ...prev, total_mcqs: totalMcqs }));
  }, [totalMcqs]);

  useEffect(() => {
    if (user && id) {
      loadForm();
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

      // strict ownership check
      if (formData.user_id !== user!.id) {
        throw new Error("You do not have permission to edit this form.");
      }

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

  if (loading || loadingForm) return <div className="flex justify-center items-center min-h-screen bg-slate-50"><div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-[72px] px-6 md:px-8 flex items-center justify-between shadow-sm/50 backdrop-blur-sm bg-white/90 supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="hover:bg-slate-100 rounded-full h-10 w-10">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
          <div className="flex flex-col justify-center h-full gap-0.5">
            <h1 className="text-lg font-bold text-slate-900 leading-none">{form.title || 'Untitled Form'}</h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-green-500' : 'bg-slate-300'}`} />
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                {isPublished ? 'Published' : 'Draft'}
                <span className="text-slate-300">•</span>
                {saving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Unsaved changes'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => saveForm()}
            variant="ghost"
            disabled={saving}
            className="text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-100 px-4 h-10 rounded-lg transition-all"
          >
            {saving ? <span className="animate-spin mr-2">⏳</span> : <Save className="w-4 h-4 mr-2" />}
            Save
          </Button>

          <Button
            onClick={publishForm}
            disabled={saving || isPublished}
            className={`font-semibold h-10 px-6 rounded-lg transition-all shadow-sm active:scale-95 ${isPublished
              ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
              : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md'
              }`}
          >
            {isPublished ? (
              <>
                <Eye className="w-4 h-4 mr-2" /> Published
              </>
            ) : (
              'Publish'
            )}
          </Button>

          {(isPublished && (id || savedFormId)) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg ml-2">
                  <Share className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Form</DialogTitle>
                </DialogHeader>
                <FormShare formId={id || savedFormId!} formTitle={form.title} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        <Tabs defaultValue="builder" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
          <div className="flex justify-center sticky top-[80px] z-20 pointer-events-none">
            <TabsList className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm p-1.5 rounded-full pointer-events-auto">
              <TabsTrigger
                value="builder"
                className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-slate-900"
              >
                Builder
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm hover:text-slate-900"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="builder" className="space-y-6 outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            {/* Title & Description Card */}
            {/* Title & Description Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-8 md:p-10 group transition-all hover:shadow-md">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Form Title"
                className="w-full text-4xl md:text-5xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:outline-none focus:ring-0 bg-transparent tracking-tight mb-4"
              />
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Form description (optional)"
                className="w-full text-lg md:text-xl text-slate-600 placeholder:text-slate-300/70 border-none focus:outline-none focus:ring-0 bg-transparent font-light"
              />
            </div>

            <QuestionsBuilder
              questions={questions}
              onQuestionsChange={setQuestions}
              isQuiz={form.is_quiz}
              timeLimit={form.time_limit_minutes}
            />
          </TabsContent>

          <TabsContent value="settings" className="outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
            <div className="max-w-2xl mx-auto">
              <FormSettings
                form={form}
                onFormChange={setForm}
                onSave={saveForm}
                saving={saving}
                lastSaved={lastSaved}
                totalMcqs={totalMcqs}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
