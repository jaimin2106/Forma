"use client";
import React, { useMemo } from 'react';
import { PremiumFormCard } from './PremiumFormCard';
import { FileText, FlaskConical } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Form = Tables<'forms'> & {
  is_quiz?: boolean;
  question_count?: number;
  response_count?: number;
};

interface SectionedFormDisplayProps {
  forms: Form[];
  onDelete: (formId: string) => void;
  onStatusChange?: () => void;
}

export function SectionedFormDisplay({ forms, onDelete, onStatusChange }: SectionedFormDisplayProps) {
  const { regularForms, exams } = useMemo(() => {
    const regular = forms.filter(form => !form.is_quiz);
    const quizzes = forms.filter(form => form.is_quiz);

    return {
      regularForms: regular,
      exams: quizzes
    };
  }, [forms]);

  if (forms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-12">
      {regularForms.length > 0 && (
        <section className="animate-fade-in group/section">
          <div className="flex items-center gap-3 mb-5 pl-1">
            <div className="w-[6px] h-6 bg-blue-600 rounded-sm shadow-sm"></div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex-1">Forms & Surveys</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 min-w-[24px] text-center">
              {regularForms.length}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularForms.map((form, index) => (
              <div
                key={form.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PremiumFormCard
                  form={form}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {exams.length > 0 && (
        <section className="animate-fade-in group/section mt-8">
          <div className="flex items-center gap-3 mb-5 pl-1">
            <div className="w-[6px] h-6 bg-violet-600 rounded-sm shadow-sm"></div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex-1">Quizzes & Exams</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 min-w-[24px] text-center">
              {exams.length}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((form, index) => (
              <div
                key={form.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PremiumFormCard
                  form={form}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
