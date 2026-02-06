
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import type { Enums } from '@/integrations/supabase/types';

type QuestionType = Enums<'question_type'>;

interface QuizQuestionSettingsProps {
  questionType: QuestionType;
  points: number;
  onPointsChange: (points: number) => void;
  correctAnswers: string[];
  onCorrectAnswersChange: (answers: string[]) => void;
  explanation: string;
  onExplanationChange: (explanation: string) => void;
  options: string[];
}

export default function QuizQuestionSettings({
  questionType,
  points,
  onPointsChange,
  correctAnswers,
  onCorrectAnswersChange,
  explanation,
  onExplanationChange,
  options,
}: QuizQuestionSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasCorrectAnswers = ['multiple_choice', 'checkbox', 'dropdown'].includes(questionType);

  const handleMultipleChoiceAnswer = (answer: string) => {
    onCorrectAnswersChange([answer]);
  };

  const handleCheckboxAnswer = (answer: string, checked: boolean) => {
    if (checked) {
      onCorrectAnswersChange([...correctAnswers, answer]);
    } else {
      onCorrectAnswersChange(correctAnswers.filter(a => a !== answer));
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 mt-4 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100/50 transition-colors">
            <h4 className="text-sm font-semibold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Quiz Answer Key
            </h4>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400">
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-5">
            {hasCorrectAnswers && options.length > 0 && (
              <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-100">
                <Label className="text-xs font-bold text-slate-400 uppercase">Select Correct Answer(s)</Label>

                {questionType === 'multiple_choice' && (
                  <RadioGroup
                    value={correctAnswers[0] || ''}
                    onValueChange={handleMultipleChoiceAnswer}
                    className="grid gap-2"
                  >
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleMultipleChoiceAnswer(option)}>
                        <RadioGroupItem value={option} id={`correct-${index}`} className="border-slate-300 text-green-600" />
                        <Label htmlFor={`correct-${index}`} className="text-sm cursor-pointer flex-1 font-medium text-slate-700">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {questionType === 'checkbox' && (
                  <div className="grid gap-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer">
                        <Checkbox
                          id={`correct-checkbox-${index}`}
                          checked={correctAnswers.includes(option)}
                          onCheckedChange={(checked) => handleCheckboxAnswer(option, !!checked)}
                          className="border-slate-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <Label htmlFor={`correct-checkbox-${index}`} className="text-sm cursor-pointer flex-1 font-medium text-slate-700">{option}</Label>
                      </div>
                    ))}
                  </div>
                )}

                {questionType === 'dropdown' && (
                  <RadioGroup
                    value={correctAnswers[0] || ''}
                    onValueChange={handleMultipleChoiceAnswer}
                    className="grid gap-2"
                  >
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleMultipleChoiceAnswer(option)}>
                        <RadioGroupItem value={option} id={`correct-dropdown-${index}`} className="border-slate-300 text-green-600" />
                        <Label htmlFor={`correct-dropdown-${index}`} className="text-sm cursor-pointer flex-1 font-medium text-slate-700">{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="explanation" className="text-xs font-bold text-slate-400 uppercase">Explanation (Shown after answer)</Label>
              <Textarea
                id="explanation"
                value={explanation}
                onChange={(e) => onExplanationChange(e.target.value)}
                placeholder="Explain why this is the correct answer to help the user learn..."
                rows={3}
                className="resize-none bg-white border-slate-200 focus:border-slate-400"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
