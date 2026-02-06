import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trash2, Copy, ChevronDown, Plus, X, GripHorizontal, GripVertical, Trophy } from 'lucide-react';
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
  isQuiz: boolean;
  onUpdate: (field: keyof QuestionData, value: any) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onFocus: () => void;
}

export default function QuestionBlock({
  question,
  index,
  isActive,
  isQuiz,
  onUpdate,
  onDuplicate,
  onDelete,
  onFocus
}: QuestionBlockProps) {
  const [isCollapsed, setIsCollapsed] = useState(!isActive && question.title !== '');
  const [options, setOptions] = useState(question.options || []);

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
    ? [{ value: 'multiple_choice', label: 'Multiple Choice' }, { value: 'checkbox', label: 'Checkbox' }, { value: 'dropdown', label: 'Dropdown' }, { value: 'text', label: 'Short Text' }, { value: 'textarea', label: 'Long Text' }]
    : [{ value: 'text', label: 'Text' }, { value: 'textarea', label: 'Long Text' }, { value: 'multiple_choice', label: 'Multiple Choice' }, { value: 'checkbox', label: 'Checkbox' }, { value: 'dropdown', label: 'Dropdown' }, { value: 'number', label: 'Number' }, { value: 'email', label: 'Email' }, { value: 'date', label: 'Date' }, { value: 'rating', label: 'Rating' }];

  return (
    <div className={`transition-all duration-300 ${isActive ? 'scale-[1.01] -translate-y-1' : 'hover:translate-y-[-2px]'}`}>
      <Card
        className={`rounded-xl border transition-all duration-300 overflow-hidden ${isActive
          ? 'shadow-2xl border-slate-900/10 ring-1 ring-slate-900/5'
          : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
          }`}
        onClick={(e) => {
          e.stopPropagation();
          onFocus();
          if (isCollapsed) setIsCollapsed(false);
        }}
      >
        {/* Active Indicator Strip */}
        {isActive && <div className="h-1.5 w-full bg-slate-900" />}

        <CardContent className="p-0">
          <Collapsible open={!isCollapsed} onOpenChange={setIsCollapsed}>
            {/* Header Bar */}
            <div className={`flex items-center justify-between p-5 cursor-pointer group ${!isCollapsed ? 'border-b border-slate-100' : ''}`} onClick={() => !isActive && onFocus()}>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Drag Handle */}
                <div className={`cursor-move text-slate-300 transition-colors ${isActive ? 'text-slate-400' : 'group-hover:text-slate-400'}`}>
                  <GripVertical className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  {isCollapsed ? (
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">{index + 1}</span>
                      <h3 className="font-medium text-slate-700 truncate">{question.title || <span className="text-slate-400 italic">Untitled Question</span>}</h3>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold">{index + 1}</span>
                      Question
                    </h3>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Quick Actions */}
                <div className="flex items-center mr-2 border-r border-slate-200 pr-2 space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                    title="Duplicate"
                    className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    title="Delete"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-100 rounded-md">
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            {/* Expanded Content */}
            <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-300">
              <div className="p-6 md:p-8 space-y-8 bg-white/50">
                <div className="flex flex-col md:flex-row gap-8">

                  {/* Left Column: Content */}
                  <div className="flex-1 space-y-5">
                    <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-300 transition-all shadow-sm">
                      <Input
                        type="text"
                        value={question.title}
                        onChange={(e) => onUpdate('title', e.target.value)}
                        placeholder="Question Title"
                        className="w-full bg-transparent border-none text-xl md:text-2xl font-semibold text-slate-900 placeholder:text-slate-300 focus-visible:ring-0 p-0 h-auto shadow-none rounded-none"
                        autoFocus={isActive}
                      />
                      <Input
                        type="text"
                        value={question.description}
                        onChange={(e) => onUpdate('description', e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full bg-transparent border-none text-base text-slate-500 placeholder:text-slate-300 focus-visible:ring-0 p-0 h-auto shadow-none mt-3 font-light"
                      />
                    </div>

                    {needsOptions && (
                      <div className="pl-1 pt-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Options</Label>
                        <div className="space-y-3">
                          {options.map((option, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-3 group">
                              <div className={`flex-shrink-0 w-4 h-4 border-2 border-slate-300 ${question.type === 'checkbox' ? 'rounded' : 'rounded-full'}`} />
                              <Input
                                value={option}
                                onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                                className="flex-1 bg-transparent border-b border-l-0 border-r-0 border-t-0 border-slate-200 focus:border-slate-800 rounded-none px-0 h-8 focus-visible:ring-0 shadow-none transition-all placeholder:text-slate-300"
                                placeholder={`Option ${optIdx + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(optIdx)}
                                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 h-8 w-8 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex items-center gap-3 pt-1">
                            <div className={`w-4 h-4 border-2 border-dashed border-slate-300 ${question.type === 'checkbox' ? 'rounded' : 'rounded-full'}`} />
                            <button
                              onClick={addOption}
                              className="text-sm text-slate-500 hover:text-slate-900 font-medium hover:underline decoration-slate-300 underline-offset-4 transition-all"
                            >
                              Add Option
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Settings */}
                  <div className="w-full md:w-72 space-y-6">
                    <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-400 uppercase">Question Type</Label>
                        <Select value={question.type} onValueChange={(value) => onUpdate('type', value)}>
                          <SelectTrigger className="bg-white border-slate-200 h-10 shadow-sm">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between py-2 border-t border-slate-200/60">
                        <Label htmlFor={`req-${index}`} className="cursor-pointer text-sm font-medium text-slate-700">Required</Label>
                        <Checkbox id={`req-${index}`} checked={question.required} onCheckedChange={(c) => onUpdate('required', !!c)} />
                      </div>

                      {isQuiz && (
                        <div className="space-y-3 pt-2 border-t border-slate-200/60">
                          <div className="flex items-center justify-between">
                            <Label className="text-amber-700 text-xs font-bold uppercase flex items-center gap-1">
                              <Trophy className="w-3 h-3" /> Points
                            </Label>
                            <span className="text-amber-900 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded text-xs">{question.points || 1}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={question.points || 1}
                            onChange={(e) => onUpdate('points', parseInt(e.target.value))}
                            className="w-full h-1.5 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer / Quiz Settings */}
                {isQuiz && needsOptions && (
                  <div className="pt-6 border-t border-slate-100">
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
