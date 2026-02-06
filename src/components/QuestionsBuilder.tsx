import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, GripVertical } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QuestionBlock from './QuestionBlock';
import TotalScoreCounter from './TotalScoreCounter';
import PreviewQuizButton from './PreviewQuizButton';
import type { Enums } from '@/integrations/supabase/types';
import { Reorder, useDragControls, AnimatePresence, motion } from 'framer-motion';

type QuestionType = Enums<'question_type'>;

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

interface QuestionsBuilderProps {
  questions: QuestionData[];
  onQuestionsChange: (questions: QuestionData[]) => void;
  isQuiz: boolean;
  timeLimit?: number;
}

export default function QuestionsBuilder({ questions, onQuestionsChange, isQuiz, timeLimit }: QuestionsBuilderProps) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(-1);

  const addQuestion = () => {
    const newQuestion: QuestionData = {
      type: isQuiz ? 'multiple_choice' : 'text',
      title: '',
      description: '',
      required: false,
      order_index: questions.length,
      ...(isQuiz && { points: 1, correct_answers: [], explanation: '', options: ['Option 1', 'Option 2'] })
    };
    const newQuestions = [...questions, newQuestion];
    onQuestionsChange(newQuestions);
    setActiveQuestionIndex(questions.length);
  };

  const updateQuestion = (index: number, field: keyof QuestionData, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    onQuestionsChange(updatedQuestions);
  };

  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = { ...questions[index] };
    delete questionToDuplicate.id;
    questionToDuplicate.title = questionToDuplicate.title + ' (Copy)';
    questionToDuplicate.order_index = questions.length;

    const newQuestions = [...questions, questionToDuplicate];
    onQuestionsChange(newQuestions);
    setActiveQuestionIndex(questions.length);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const reorderedQuestions = updatedQuestions.map((q, i) => ({ ...q, order_index: i }));
    onQuestionsChange(reorderedQuestions);
    setActiveQuestionIndex(-1);
  };

  const totalPoints = isQuiz ? questions.reduce((sum, q) => sum + (q.points || 1), 0) : 0;

  const validateQuizQuestions = () => {
    if (!isQuiz) return [];
    const errors: string[] = [];
    questions.forEach((question, index) => {
      if (['multiple_choice', 'checkbox', 'dropdown'].includes(question.type)) {
        if (!question.correct_answers || question.correct_answers.length === 0) {
          errors.push(`Question ${index + 1}: No correct answer selected`);
        }
        if (!question.options || question.options.length < 2) {
          errors.push(`Question ${index + 1}: At least 2 options required`);
        }
      }
    });
    return errors;
  };

  const validationErrors = validateQuizQuestions();

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between sticky top-[140px] z-10 py-4 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Questions
          <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{questions.length}</span>
        </h2>
        <div className="flex items-center gap-3">
          <TotalScoreCounter totalPoints={totalPoints} questionCount={questions.length} isQuiz={isQuiz} />
          {isQuiz && <PreviewQuizButton questions={questions} isQuiz={isQuiz} timeLimit={timeLimit} totalPoints={totalPoints} />}
        </div>
      </div>

      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Please fix the following issues:</p>
              {validationErrors.map((error, index) => (
                <p key={index} className="text-sm opacity-90">• {error}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <AnimatePresence mode='popLayout'>
          {questions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl hover:border-violet-300 hover:bg-violet-50/30 transition-all cursor-pointer group"
              onClick={addQuestion}
            >
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-violet-600 transition-colors duration-300">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Start Building Your Form</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">Add your first question to get started with your {isQuiz ? 'quiz' : 'form'}.</p>
              <Button onClick={(e) => { e.stopPropagation(); addQuestion(); }} size="lg" className="rounded-full shadow-lg shadow-violet-500/20">Add Question</Button>
            </motion.div>
          ) : (
            questions.map((question, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                key={question.id || index} // Ideally distinct ID, fallback to index mostly fine here if id not present visually
              >
                <QuestionBlock
                  question={question}
                  index={index}
                  isActive={activeQuestionIndex === index}
                  isQuiz={isQuiz}
                  onUpdate={(field, value) => updateQuestion(index, field, value)}
                  onDuplicate={() => duplicateQuestion(index)}
                  onDelete={() => removeQuestion(index)}
                  onFocus={() => setActiveQuestionIndex(index)}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {questions.length > 0 && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-4 flex justify-center"
        >
          <Button
            onClick={addQuestion}
            variant="outline"
            size="lg"
            className="w-full md:w-auto min-w-[300px] h-14 border-dashed border-2 hover:border-slate-900 hover:bg-white text-slate-500 hover:text-slate-900 transition-all rounded-full text-base font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Question
          </Button>
        </motion.div>
      )}
    </div>
  );
}
