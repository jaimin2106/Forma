
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { OptimizedInput } from '@/components/ui/optimized-input';
import { motion } from 'framer-motion';
import type { Tables } from '@/integrations/supabase/types';

import { cn } from '@/lib/utils';

type Question = Tables<'questions'>;

interface ExamQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export function ExamQuestion({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
  disabled = false,
  hideHeader = false
}: ExamQuestionProps & { hideHeader?: boolean }) {
  const renderQuestionInput = () => {
    const rawOptions = question.options;
    const options = Array.isArray(rawOptions)
      ? rawOptions
      : typeof rawOptions === 'string'
        ? (JSON.parse(rawOptions) as string[])
        : [];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <RadioGroup
            value={value}
            onValueChange={onChange}
            disabled={disabled}
            className="grid gap-4"
          >
            {options.map((option: string) => (
              <div
                key={option}
                className={cn(
                  "flex items-center space-x-3 space-y-0 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-slate-300",
                  value === option ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-100"
                )}
                onClick={() => !disabled && onChange(option)}
              >
                <RadioGroupItem value={option} id={option} className="sr-only" />
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  value === option ? "border-slate-900 bg-slate-900" : "border-slate-300"
                )}>
                  {value === option && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <Label
                  htmlFor={option}
                  className="text-lg font-medium cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const selectedOptions = Array.isArray(value) ? value : [];
        const toggleOption = (option: string) => {
          if (selectedOptions.includes(option)) {
            onChange(selectedOptions.filter((i: string) => i !== option));
          } else {
            onChange([...selectedOptions, option]);
          }
        };

        return (
          <div className="grid gap-4">
            {options.map((option: string) => (
              <div
                key={option}
                className={cn(
                  "flex items-center space-x-3 space-y-0 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-slate-300",
                  selectedOptions.includes(option) ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-100"
                )}
                onClick={() => !disabled && toggleOption(option)}
              >
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                  selectedOptions.includes(option) ? "border-slate-900 bg-slate-900" : "border-slate-300"
                )}>
                  {selectedOptions.includes(option) && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
                <Label className="text-lg font-medium cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <div className="space-y-1.5 w-full">
            <Label className="block text-sm font-medium text-slate-700 ml-1">
              {question.title}
              {question.required && <span className="text-violet-600 ml-0.5">*</span>}
            </Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
              <SelectTrigger className="w-full text-base md:text-lg bg-white border border-slate-200 rounded-xl px-4 py-3 h-auto focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all duration-200">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-100 shadow-xl rounded-xl">
                {options.map((option: string) => (
                  <SelectItem key={option} value={option} className="text-base py-2.5 px-4 focus:bg-slate-50 focus:text-slate-900 cursor-pointer">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );


      case 'text':
      case 'email':
      case 'number':
        return (
          <OptimizedInput
            id={question.id}
            label={question.title}
            type={question.type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="text-lg"
          />
        );


      case 'textarea':
        return (
          <OptimizedInput
            label="Your Answer"
            placeholder="Type your answer here..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            multiline
            className="min-h-[150px] text-lg"
          />
        );

      case 'rating':
        return (
          <div className="flex gap-4 justify-center py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                disabled={disabled}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium transition-all",
                  value === star
                    ? "bg-slate-900 text-white shadow-lg scale-110"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                )}
              >
                {star}
              </button>
            ))}
          </div>
        );


      case 'date':
        return (
          <OptimizedInput
            id={question.id}
            label="Select Date"
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="text-lg"
          />
        );

      default:
        return <div className="text-slate-400 italic">Unsupported question type: {question.type}</div>;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!hideHeader && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Question {questionNumber} <span className="text-gray-300">/</span> {totalQuestions}
            </span>
            {question.required && (
              <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                Required
              </span>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 leading-tight">
            {question.title}
          </h2>

          {question.description && (
            <p className="text-lg text-gray-500 leading-relaxed">
              {question.description}
            </p>
          )}
        </div>
      )}

      <div className="min-h-[120px]">
        {renderQuestionInput()}
      </div>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
