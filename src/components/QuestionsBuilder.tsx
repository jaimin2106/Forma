import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Undo2, Redo2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QuestionBlock from './QuestionBlock';
import TotalScoreCounter from './TotalScoreCounter';
import PreviewQuizButton from './PreviewQuizButton';
import type { Enums } from '@/integrations/supabase/types';
import { Reorder, AnimatePresence, motion, useDragControls } from 'framer-motion';
import { useBuilderShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { toast } from '@/components/ui/use-toast';

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

// Generate a unique ID for new questions
const generateQuestionId = () => `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Individual question item with drag controls
interface QuestionItemProps {
  question: QuestionData;
  index: number;
  isActive: boolean;
  isDragging: boolean;
  isQuiz: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onUpdate: (field: keyof QuestionData, value: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onFocus: () => void;
  onInsert: () => void;
}

function QuestionItem({
  question,
  index,
  isActive,
  isDragging,
  isQuiz,
  onDragStart,
  onDragEnd,
  onUpdate,
  onDuplicate,
  onDelete,
  onFocus,
  onInsert,
}: QuestionItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={question}
      id={`question-${question.id}`}
      dragListener={false}
      dragControls={dragControls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="relative"
      style={{ zIndex: isDragging && isActive ? 50 : 'auto' }}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } }}
      whileDrag={{
        scale: 1.02,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        cursor: 'grabbing'
      }}
      transition={{ duration: 0.15, type: 'tween', ease: 'easeOut' }}
      layout
    >
      {/* Insertion point removed - cleaner interface */}

      <QuestionBlock
        question={question}
        index={index}
        isActive={isActive}
        isDragging={isDragging}
        isQuiz={isQuiz}
        onUpdate={onUpdate}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onFocus={onFocus}
        onDragHandlePointerDown={(e) => dragControls.start(e)}
      />
    </Reorder.Item>
  );
}

export default function QuestionsBuilder({ questions, onQuestionsChange, isQuiz, timeLimit }: QuestionsBuilderProps) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(-1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Undo/Redo system
  const {
    pushState,
    undo: undoHistory,
    redo: redoHistory,
    canUndo,
    canRedo,
    reset: resetHistory
  } = useUndoRedo(questions);

  // Sync external questions with undo history
  useEffect(() => {
    resetHistory(questions);
  }, []);

  // Add question
  const addQuestion = useCallback((insertIndex?: number) => {
    const newQuestion: QuestionData = {
      id: generateQuestionId(),
      type: isQuiz ? 'multiple_choice' : 'text',
      title: '',
      description: '',
      required: false,
      order_index: questions.length,
      ...(isQuiz && { points: 1, correct_answers: [], explanation: '', options: ['Option 1', 'Option 2'] })
    };

    let newQuestions: QuestionData[];
    if (insertIndex !== undefined && insertIndex >= 0) {
      newQuestions = [
        ...questions.slice(0, insertIndex),
        newQuestion,
        ...questions.slice(insertIndex)
      ].map((q, i) => ({ ...q, order_index: i }));
      setActiveQuestionIndex(insertIndex);
    } else {
      newQuestions = [...questions, newQuestion];
      setActiveQuestionIndex(questions.length);
    }

    onQuestionsChange(newQuestions);
    pushState(newQuestions, 'add');

    // Auto-scroll to new question after render
    setTimeout(() => {
      const newQuestionElement = document.getElementById(`question-${newQuestion.id}`);
      newQuestionElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Focus the title input
      setTimeout(() => {
        const titleInput = newQuestionElement?.querySelector('input[data-question-title]') as HTMLInputElement;
        titleInput?.focus();
      }, 350);
    }, 100);
  }, [questions, isQuiz, onQuestionsChange, pushState]);

  // Update question
  const updateQuestion = useCallback((index: number, field: keyof QuestionData, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    onQuestionsChange(updatedQuestions);
    // Don't push to history on every keystroke - handled by autosave
  }, [questions, onQuestionsChange]);

  // Duplicate question
  const duplicateQuestion = useCallback((index: number) => {
    const questionToDuplicate = { ...questions[index] };
    const duplicatedQuestion = {
      ...questionToDuplicate,
      id: generateQuestionId(),
      title: `${questionToDuplicate.title} (Copy)`,
      order_index: questions.length,
    };

    const newQuestions = [...questions, duplicatedQuestion];
    onQuestionsChange(newQuestions);
    pushState(newQuestions, 'duplicate');
    setActiveQuestionIndex(questions.length);

    toast({ title: "Question duplicated", description: "A copy has been added at the end." });
  }, [questions, onQuestionsChange, pushState]);

  // Remove question
  const removeQuestion = useCallback((index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    const reorderedQuestions = updatedQuestions.map((q, i) => ({ ...q, order_index: i }));
    onQuestionsChange(reorderedQuestions);
    pushState(reorderedQuestions, 'delete');

    // Focus previous question or next if deleting first
    if (activeQuestionIndex >= reorderedQuestions.length) {
      setActiveQuestionIndex(reorderedQuestions.length - 1);
    } else if (activeQuestionIndex === index && index > 0) {
      setActiveQuestionIndex(index - 1);
    }
  }, [questions, activeQuestionIndex, onQuestionsChange, pushState]);

  // Move question up
  const moveQuestionUp = useCallback(() => {
    if (activeQuestionIndex <= 0) return;

    const newQuestions = [...questions];
    [newQuestions[activeQuestionIndex - 1], newQuestions[activeQuestionIndex]] =
      [newQuestions[activeQuestionIndex], newQuestions[activeQuestionIndex - 1]];

    const reorderedQuestions = newQuestions.map((q, i) => ({ ...q, order_index: i }));
    onQuestionsChange(reorderedQuestions);
    pushState(reorderedQuestions, 'reorder');
    setActiveQuestionIndex(activeQuestionIndex - 1);
  }, [questions, activeQuestionIndex, onQuestionsChange, pushState]);

  // Move question down
  const moveQuestionDown = useCallback(() => {
    if (activeQuestionIndex >= questions.length - 1 || activeQuestionIndex < 0) return;

    const newQuestions = [...questions];
    [newQuestions[activeQuestionIndex], newQuestions[activeQuestionIndex + 1]] =
      [newQuestions[activeQuestionIndex + 1], newQuestions[activeQuestionIndex]];

    const reorderedQuestions = newQuestions.map((q, i) => ({ ...q, order_index: i }));
    onQuestionsChange(reorderedQuestions);
    pushState(reorderedQuestions, 'reorder');
    setActiveQuestionIndex(activeQuestionIndex + 1);
  }, [questions, activeQuestionIndex, onQuestionsChange, pushState]);

  // Undo
  const handleUndo = useCallback(() => {
    const previousState = undoHistory();
    if (previousState) {
      onQuestionsChange(previousState as QuestionData[]);
      toast({ title: "Undone", description: "Previous action has been undone." });
    }
  }, [undoHistory, onQuestionsChange]);

  // Redo
  const handleRedo = useCallback(() => {
    const nextState = redoHistory();
    if (nextState) {
      onQuestionsChange(nextState as QuestionData[]);
      toast({ title: "Redone", description: "Action has been redone." });
    }
  }, [redoHistory, onQuestionsChange]);

  // Handle reorder via drag
  const handleReorder = useCallback((newOrder: QuestionData[]) => {
    const reorderedQuestions = newOrder.map((q, i) => ({ ...q, order_index: i }));
    onQuestionsChange(reorderedQuestions);
  }, [onQuestionsChange]);

  // Handle drag end - push to history
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    pushState(questions, 'reorder');
  }, [questions, pushState]);

  // Keyboard shortcuts
  useBuilderShortcuts({
    onAddQuestion: () => addQuestion(),
    onDeleteQuestion: () => activeQuestionIndex >= 0 && removeQuestion(activeQuestionIndex),
    onDuplicateQuestion: () => activeQuestionIndex >= 0 && duplicateQuestion(activeQuestionIndex),
    onMoveUp: moveQuestionUp,
    onMoveDown: moveQuestionDown,
    onUndo: handleUndo,
    onRedo: handleRedo,
    activeQuestionIndex,
    questionsCount: questions.length,
    enabled: !isDragging,
  });

  // Click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveQuestionIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div ref={containerRef} className="space-y-6 pb-32">
      {/* Section Header - Not sticky, part of canvas */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Questions</h2>
            <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-medium">
              {questions.length}
            </span>

            {/* Undo/Redo buttons */}
            <div className="flex items-center gap-0.5 ml-2 pl-3 border-l border-slate-200">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={!canUndo}
                className="h-7 w-7 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={!canRedo}
                className="h-7 w-7 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TotalScoreCounter totalPoints={totalPoints} questionCount={questions.length} isQuiz={isQuiz} />
            {isQuiz && <PreviewQuizButton questions={questions} isQuiz={isQuiz} timeLimit={timeLimit} totalPoints={totalPoints} />}
          </div>
        </div>

        {/* Keyboard shortcuts hint - compact */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-mono">A</kbd> Add</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-mono">⌘D</kbd> Duplicate</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-mono">⇧↑↓</kbd> Reorder</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-mono">⌘Z</kbd> Undo</span>
        </div>
      </div>

      {/* Validation errors */}
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

      {/* Questions list with drag-and-drop */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {questions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-24 border-2 border-dashed border-slate-200 rounded-2xl hover:border-slate-400 hover:bg-slate-50/50 transition-all cursor-pointer group"
              onClick={() => addQuestion()}
            >
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-slate-600 transition-all duration-300">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Start Building Your Form</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
                Add your first question to get started with your {isQuiz ? 'quiz' : 'form'}.
              </p>
              <Button
                onClick={(e) => { e.stopPropagation(); addQuestion(); }}
                size="lg"
                className="rounded-full shadow-lg shadow-slate-900/10 bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Question
              </Button>
            </motion.div>
          ) : (
            <Reorder.Group
              axis="y"
              values={questions}
              onReorder={handleReorder}
              className="space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {questions.map((question, index) => (
                  <QuestionItem
                    key={question.id || `question-${index}`}
                    question={question}
                    index={index}
                    isActive={activeQuestionIndex === index}
                    isDragging={isDragging}
                    isQuiz={isQuiz}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={handleDragEnd}
                    onUpdate={(field, value) => updateQuestion(index, field, value)}
                    onDuplicate={() => duplicateQuestion(index)}
                    onDelete={() => removeQuestion(index)}
                    onFocus={() => setActiveQuestionIndex(index)}
                    onInsert={() => addQuestion(index)}
                  />
                ))}
              </AnimatePresence>
            </Reorder.Group>
          )}
        </AnimatePresence>
      </div>

      {/* Add question button */}
      {questions.length > 0 && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-4 flex justify-center"
        >
          <Button
            onClick={() => addQuestion()}
            variant="outline"
            size="lg"
            className="w-full md:w-auto min-w-[300px] h-14 border-dashed border-2 hover:border-slate-900 hover:bg-white text-slate-500 hover:text-slate-900 transition-all rounded-full text-base font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Question
          </Button>
        </motion.div>
      )}

      {/* Mobile floating add button */}
      <button
        onClick={() => addQuestion()}
        className="floating-fab md:hidden"
        aria-label="Add question"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
