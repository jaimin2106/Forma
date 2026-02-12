import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Copy, ChevronDown, Plus, X, GripVertical, Trophy, Type, ListChecks, Hash, Mail, Calendar, Star, AlignLeft, ChevronRight } from 'lucide-react';
import QuizQuestionSettings from './QuizQuestionSettings';
import type { Enums } from '@/integrations/supabase/types';

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

interface QuestionBlockProps {
  question: QuestionData;
  index: number;
  isActive: boolean;
  isDragging?: boolean;
  isQuiz: boolean;
  onUpdate: (field: keyof QuestionData, value: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onFocus: () => void;
  onDragHandlePointerDown?: (e: React.PointerEvent) => void;
}

// Question type icons mapping
const questionTypeIcons: Record<string, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  textarea: <AlignLeft className="w-4 h-4" />,
  multiple_choice: <ListChecks className="w-4 h-4" />,
  checkbox: <ListChecks className="w-4 h-4" />,
  dropdown: <ChevronDown className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  rating: <Star className="w-4 h-4" />,
};

export default function QuestionBlock({
  question,
  index,
  isActive,
  isDragging = false,
  isQuiz,
  onUpdate,
  onDuplicate,
  onDelete,
  onFocus,
  onDragHandlePointerDown
}: QuestionBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(!isActive && question.title !== '');
  const [options, setOptions] = useState(question.options || []);
  const [isHovered, setIsHovered] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync options when question changes
  useEffect(() => {
    setOptions(question.options || []);
  }, [question.options]);

  // Auto-expand when active
  useEffect(() => {
    if (isActive && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isActive]);

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...options];
    newOptions[optionIndex] = value;
    setOptions(newOptions);
    onUpdate('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [...options, `Option ${options.length + 1}`];
    setOptions(newOptions);
    onUpdate('options', newOptions);
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = options.filter((_, i) => i !== optionIndex);
    setOptions(newOptions);
    onUpdate('options', newOptions);

    if (isQuiz && question.correct_answers) {
      const removedOption = options[optionIndex];
      const updatedCorrectAnswers = question.correct_answers.filter(answer => answer !== removedOption);
      onUpdate('correct_answers', updatedCorrectAnswers);
    }
  };

  const needsOptions = ['multiple_choice', 'checkbox', 'dropdown'].includes(question.type);

  const availableTypes = isQuiz
    ? [
      { value: 'multiple_choice', label: 'Multiple Choice', icon: <ListChecks className="w-4 h-4" /> },
      { value: 'checkbox', label: 'Checkbox', icon: <ListChecks className="w-4 h-4" /> },
      { value: 'dropdown', label: 'Dropdown', icon: <ChevronDown className="w-4 h-4" /> },
      { value: 'text', label: 'Short Text', icon: <Type className="w-4 h-4" /> },
      { value: 'textarea', label: 'Long Text', icon: <AlignLeft className="w-4 h-4" /> },
    ]
    : [
      { value: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
      { value: 'textarea', label: 'Long Text', icon: <AlignLeft className="w-4 h-4" /> },
      { value: 'multiple_choice', label: 'Multiple Choice', icon: <ListChecks className="w-4 h-4" /> },
      { value: 'checkbox', label: 'Checkbox', icon: <ListChecks className="w-4 h-4" /> },
      { value: 'dropdown', label: 'Dropdown', icon: <ChevronDown className="w-4 h-4" /> },
      { value: 'number', label: 'Number', icon: <Hash className="w-4 h-4" /> },
      { value: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
      { value: 'date', label: 'Date', icon: <Calendar className="w-4 h-4" /> },
      { value: 'rating', label: 'Rating', icon: <Star className="w-4 h-4" /> },
    ];

  const getTypeLabel = () => {
    const type = availableTypes.find(t => t.value === question.type);
    return type?.label || question.type;
  };

  return (
    <div
      className={`transition-all duration-200 ${isActive ? '-translate-y-0.5' : ''} ${isHovered && !isActive ? '-translate-y-px' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`
          rounded-2xl border-2 transition-all duration-200 overflow-hidden
          ${isActive
            ? 'bg-[#F8FAFF] border-slate-900 shadow-builder-card-active ring-1 ring-slate-900/5'
            : isHovered
              ? 'bg-white border-slate-300 shadow-builder-card-hover'
              : 'bg-white border-slate-200/80 shadow-builder-card'
          }
          ${isDragging ? 'shadow-builder-card-drag' : ''}
        `}
        onClick={(e) => {
          e.stopPropagation();
          onFocus();
          if (isCollapsed) setIsCollapsed(false);
        }}
      >
        <CardContent className="p-0">
          <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
            {/* Header Bar */}
            <div
              className={`
                flex items-center gap-3 p-5 cursor-pointer group
                ${!isCollapsed ? 'border-b border-slate-100' : ''}
              `}
            >
              {/* Drag Handle - Mobile optimized */}
              <div
                className={`
                  drag-handle flex items-center justify-center w-10 h-10 md:w-8 md:h-8 -ml-1 rounded-lg cursor-grab active:cursor-grabbing
                  transition-all duration-150 touch-none
                  opacity-100 md:opacity-0 md:group-hover:opacity-100
                  ${isActive || isHovered ? 'md:opacity-100' : ''}
                  hover:bg-slate-100 active:bg-slate-200
                `}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={onDragHandlePointerDown}
              >
                <GripVertical className="h-5 w-5 md:h-4 md:w-4 text-slate-400" />
              </div>

              {/* Question number badge */}
              <div className={`
                flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                transition-colors duration-150
                ${isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600'
                }
              `}>
                {index + 1}
              </div>

              {/* Content preview / title */}
              <div className="flex-1 min-w-0">
                {isCollapsed ? (
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{questionTypeIcons[question.type]}</span>
                    <h3 className="font-medium text-slate-700 truncate">
                      {question.title || <span className="text-slate-400 italic">Untitled Question</span>}
                    </h3>
                    {question.required && (
                      <span className="flex-shrink-0 text-red-500 text-xs font-medium">Required</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{questionTypeIcons[question.type]}</span>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      {getTypeLabel()}
                    </span>
                    {question.required && (
                      <span className="text-red-500 text-xs font-medium ml-2">*</span>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Actions - Always visible on mobile */}
              <div className={`
                flex items-center gap-1 transition-opacity duration-150
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                ${isActive || isHovered ? 'md:opacity-100' : ''}
              `}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                  title="Duplicate (Ctrl+D)"
                  className="h-10 w-10 md:h-8 md:w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  title="Delete"
                  className="h-10 w-10 md:h-8 md:w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-5 bg-slate-200 mx-1 hidden md:block" />
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 md:h-8 md:w-8 text-slate-400 hover:bg-slate-100 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Expanded Content */}
            <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Content */}
                  <div className="flex-1 space-y-5">
                    {/* Title & Description */}
                    <div className={`
                      bg-slate-50/80 p-5 rounded-xl border transition-all duration-200
                      ${isActive ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-100'}
                    `}>
                      <Input
                        ref={titleInputRef}
                        data-question-title
                        type="text"
                        value={question.title}
                        onChange={(e) => onUpdate('title', e.target.value)}
                        placeholder="Enter your question..."
                        className="w-full bg-transparent border-none text-xl md:text-2xl font-semibold text-slate-900 placeholder:text-slate-300 focus-visible:ring-0 p-0 h-auto shadow-none rounded-none"
                        autoFocus={isActive && !question.title}
                      />
                      <Input
                        type="text"
                        value={question.description}
                        onChange={(e) => onUpdate('description', e.target.value)}
                        placeholder="Add description (optional)"
                        className="w-full bg-transparent border-none text-base text-slate-500 placeholder:text-slate-300 focus-visible:ring-0 p-0 h-auto shadow-none mt-3 font-light"
                      />
                    </div>

                    {/* Options for choice questions */}
                    {needsOptions && (
                      <div className="space-y-3">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          Options
                        </Label>
                        <div className="space-y-2">
                          {options.map((option, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-3 group">
                              <div className={`
                                flex-shrink-0 w-5 h-5 border-2 border-slate-300 flex items-center justify-center
                                ${question.type === 'checkbox' ? 'rounded' : 'rounded-full'}
                              `}>
                                {isQuiz && question.correct_answers?.includes(option) && (
                                  <div className={`w-2.5 h-2.5 bg-emerald-500 ${question.type === 'checkbox' ? 'rounded-sm' : 'rounded-full'}`} />
                                )}
                              </div>
                              <Input
                                value={option}
                                onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                                className="flex-1 bg-transparent border-0 border-b border-slate-200 focus:border-slate-400 rounded-none px-0 h-9 focus-visible:ring-0 shadow-none transition-all placeholder:text-slate-300"
                                placeholder={`Option ${optIdx + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(optIdx)}
                                className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-slate-300 hover:text-red-500 h-10 w-10 md:h-8 md:w-8 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <button
                            onClick={addOption}
                            className="flex items-center gap-3 text-sm text-slate-500 hover:text-slate-700 font-medium py-2 transition-colors"
                          >
                            <div className={`w-5 h-5 border-2 border-dashed border-slate-300 ${question.type === 'checkbox' ? 'rounded' : 'rounded-full'}`} />
                            <span className="hover:underline underline-offset-4">Add option</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Settings */}
                  <div className="w-full lg:w-64 space-y-4">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
                      {/* Question Type */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type</Label>
                        <Select value={question.type} onValueChange={(value) => onUpdate('type', value)}>
                          <SelectTrigger className="bg-white border-slate-200 h-10 shadow-sm">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTypes.map(t => (
                              <SelectItem key={t.value} value={t.value}>
                                <div className="flex items-center gap-2">
                                  {t.icon}
                                  <span>{t.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Required toggle */}
                      <div className="flex items-center justify-between py-2 border-t border-slate-200/60">
                        <Label htmlFor={`req-${index}`} className="cursor-pointer text-sm font-medium text-slate-700">
                          Required
                        </Label>
                        <Checkbox
                          id={`req-${index}`}
                          checked={question.required}
                          onCheckedChange={(c) => onUpdate('required', !!c)}
                        />
                      </div>

                      {/* Quiz points */}
                      {isQuiz && (
                        <div className="space-y-3 pt-2 border-t border-slate-200/60">
                          <div className="flex items-center justify-between">
                            <Label className="text-amber-700 text-xs font-bold uppercase flex items-center gap-1.5">
                              <Trophy className="w-3.5 h-3.5" /> Points
                            </Label>
                            <span className="text-amber-900 font-mono font-bold bg-amber-100 px-2.5 py-1 rounded text-sm">
                              {question.points || 1}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={question.points || 1}
                            onChange={(e) => onUpdate('points', parseInt(e.target.value))}
                            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quiz answer settings */}
                {isQuiz && needsOptions && (
                  <div className="pt-4 border-t border-slate-100">
                    <QuizQuestionSettings
                      questionType={question.type}
                      points={question.points || 1}
                      onPointsChange={(p) => onUpdate('points', p)}
                      correctAnswers={question.correct_answers || []}
                      onCorrectAnswersChange={(a) => onUpdate('correct_answers', a)}
                      explanation={question.explanation || ''}
                      onExplanationChange={(e) => onUpdate('explanation', e)}
                      options={options}
                    />
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}
