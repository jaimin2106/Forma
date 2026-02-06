import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { formTemplates, templateCategories } from "@/data/formTemplates";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/Logo";
import { OptimizedInput } from "@/components/ui/optimized-input";
import { ExamQuestion } from "@/components/exam/ExamQuestion";

// React Icons
import {
  RiLayoutGridFill,
  RiSearchLine,
  RiBriefcase4Line,
  RiBookOpenLine,
  RiCodeBoxLine,
  RiTeamLine,
  RiAppsLine,
  RiCheckDoubleLine,
  RiCloseLine,
  RiArrowLeftLine
} from "react-icons/ri";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

interface FormTemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: (typeof formTemplates)[0]) => void;
}

const CategoryIcon = ({ category, className }: { category: string; className?: string }) => {
  switch (category) {
    case 'Business': return <RiBriefcase4Line className={className} />;
    case 'Education': return <RiBookOpenLine className={className} />;
    case 'Technical': return <RiCodeBoxLine className={className} />;
    case 'Community': return <RiTeamLine className={className} />;
    default: return <RiAppsLine className={className} />;
  }
};

const categoryStyles: Record<string, string> = {
  Business: "bg-blue-50 text-blue-600 border-blue-100",
  Education: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Technical: "bg-violet-50 text-violet-600 border-violet-100",
  Community: "bg-orange-50 text-orange-600 border-orange-100",
  Other: "bg-slate-50 text-slate-600 border-slate-100",
};

export function FormTemplateSelector({
  open,
  onOpenChange,
  onSelectTemplate,
}: FormTemplateSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [query, setQuery] = useState<string>("");
  const [preview, setPreview] = useState<(typeof formTemplates)[0] | null>(null);

  // Preview State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [direction, setDirection] = useState(0);

  // Reset preview state when preview opens/changes
  useEffect(() => {
    if (preview) {
      setCurrentQuestionIndex(0);
      setFormData({});
      setDirection(0);
    }
  }, [preview]);

  const categories = useMemo(
    () => ["All", ...templateCategories],
    [templateCategories]
  );

  const filtered = useMemo(() => {
    let result = formTemplates;

    if (activeTab !== "All") {
      result = result.filter((t) => t.category === activeTab);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeTab, query]);

  // Handle Preview Navigation
  const handleNext = () => {
    if (!preview) return;
    if (currentQuestionIndex < preview.questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[1200px] w-[95vw] h-[90vh] p-0 bg-white border-none shadow-2xl gap-0 overflow-hidden flex flex-col rounded-2xl"
        aria-label="Template Gallery"
      >
        {/* Header Section (Only visible when NOT previewing) */}
        {!preview && (
          <div className="flex-none px-6 md:px-10 py-8 bg-white z-10 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <div className="space-y-2">
                <DialogTitle className="flex items-center gap-3 text-3xl font-bold text-slate-900 tracking-tight">
                  <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-xl shadow-slate-900/20">
                    <RiLayoutGridFill className="w-6 h-6" />
                  </div>
                  Template Gallery
                </DialogTitle>
              </div>
              <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-full h-10 w-10 p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <RiCloseLine className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
              <div className="flex flex-wrap gap-2 w-full md:w-auto p-1 bg-slate-50/50 rounded-xl border border-slate-100">
                {categories.map((category) => {
                  const isActive = activeTab === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveTab(category)}
                      className={cn(
                        "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2",
                        isActive ? "text-slate-900 shadow-sm bg-white ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                      )}
                    >
                      {category !== "All" && (
                        <CategoryIcon category={category} className={cn("w-4 h-4", isActive ? "opacity-100" : "opacity-60")} />
                      )}
                      {category}
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 rounded-lg -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="relative w-full md:w-80 group">
                <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/30 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all shadow-sm focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Templates Grid / Preview Switcher */}
        <div className="flex-1 overflow-hidden relative bg-slate-50">
          <AnimatePresence mode="popLayout" initial={false}>
            {/* Grid View */}
            {!preview ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full overflow-y-auto px-6 md:px-10 pb-10 bg-gradient-to-b from-white to-slate-50/50 scroll-smooth pt-8"
              >
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
                      <RiSearchLine className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No templates found</h3>
                    <p className="text-slate-500 max-w-sm">
                      We couldn't find matches for "{query}". Try adjusting your search.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.map((template, idx) => (
                      <motion.div
                        layout
                        key={template.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="group relative bg-white rounded-2xl border border-slate-100 hover:border-violet-200 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                        onClick={() => setPreview(template)}
                      >
                        <div className="p-6 flex flex-col gap-5 flex-1 z-10">
                          <div className="flex items-start justify-between gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out text-slate-700">
                                {template.icon}
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className={cn("font-medium border px-3 py-1 rounded-full text-xs shadow-none transition-colors duration-300", categoryStyles[template.category] || categoryStyles.Other)}
                            >
                              {template.category}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-violet-700 transition-colors duration-300 line-clamp-1">{template.name}</h3>
                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{template.description}</p>
                          </div>
                        </div>
                        <div className="p-6 pt-0 mt-auto z-10">
                          <Button variant="outline" className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-600">
                            Preview
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              // Live Interactive Preview
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="absolute inset-0 bg-white flex flex-col font-sans"
              >
                {/* Mock Public Form Header */}
                <header className="flex-none h-16 px-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-sm z-20">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setPreview(null)} className="text-slate-500 hover:text-slate-900">
                      <RiArrowLeftLine className="mr-2" /> Back
                    </Button>
                    <div className="h-6 w-px bg-slate-200" />
                    <div className="scale-75 origin-left">
                      <Logo />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden md:inline-block text-xs font-medium text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                      Preview
                    </span>
                    <Button
                      onClick={() => {
                        onSelectTemplate(preview);
                        onOpenChange(false);
                      }}
                      className="bg-slate-900 hover:bg-violet-600 text-white shadow-lg shadow-slate-900/10 hover:shadow-violet-600/20"
                    >
                      Use Template <RiCheckDoubleLine className="ml-2" />
                    </Button>
                  </div>
                </header>

                {/* Progress Line */}
                <div className="relative w-full h-1 bg-slate-50">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-slate-900"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / preview.questions.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>

                {/* Main Form Content */}
                <div className="flex-1 overflow-y-auto w-full">
                  <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-12 w-full">
                    <div className="w-full max-w-2xl mx-auto">
                      <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                          key={preview.questions[currentQuestionIndex].id}
                          custom={direction}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-8"
                        >
                          {/* Question Meta */}
                          <div className="flex items-center gap-3 text-slate-400 mb-2">
                            <span className="text-sm font-medium uppercase tracking-widest">
                              Question {currentQuestionIndex + 1} of {preview.questions.length}
                            </span>
                            {preview.questions[currentQuestionIndex].required && (
                              <span className="text-xs border border-slate-200 px-2 py-0.5 rounded-full">Required</span>
                            )}
                          </div>

                          {/* Question Title */}
                          <div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
                              {preview.questions[currentQuestionIndex].title}
                            </h2>
                            {preview.questions[currentQuestionIndex].description && (
                              <p className="mt-2 text-lg text-slate-500 font-light max-w-2xl">
                                {preview.questions[currentQuestionIndex].description}
                              </p>
                            )}
                          </div>

                          {/* Input Area */}
                          <div className="pt-4 pb-8 min-h-[120px]">
                            {(() => {
                              const q = preview.questions[currentQuestionIndex];

                              if (['text', 'textarea', 'number', 'email', 'dropdown'].includes(q.type)) {
                                return (
                                  <OptimizedInput
                                    value={formData[q.id] || ''}
                                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                                    multiline={q.type === 'textarea'}
                                    options={q.type === 'dropdown' ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : undefined}
                                    placeholder="Type your answer here..."
                                    type={q.type === 'number' ? 'number' : q.type === 'email' ? 'email' : 'text'}
                                    autoFocus
                                  />
                                )
                              } else {
                                return (
                                  <div className="w-full">
                                    <ExamQuestion
                                      question={q as any}
                                      questionNumber={currentQuestionIndex + 1}
                                      totalQuestions={preview.questions.length}
                                      value={formData[q.id]}
                                      onChange={(val) => handleInputChange(q.id, val)}
                                      hideHeader={true}
                                    />
                                  </div>
                                )
                              }
                            })()}
                          </div>

                          {/* Navigation */}
                          <div className="pt-8 flex items-center justify-between border-t border-slate-100">
                            <div className="flex items-center gap-4">
                              <Button
                                onClick={handleNext}
                                size="lg"
                                className="h-12 px-8 text-lg bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                disabled={currentQuestionIndex === preview.questions.length - 1}
                              >
                                OK <Check className="ml-2 w-4 h-4" />
                              </Button>
                              <div className="hidden sm:flex text-xs text-slate-400 items-center gap-1">
                                press <kbd className="font-bold font-sans">Enter ↵</kbd>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" size="icon" onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="rounded-full hover:bg-slate-100 disabled:opacity-30">
                                <ChevronLeft className="w-6 h-6 text-slate-600" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={handleNext} disabled={currentQuestionIndex === preview.questions.length - 1} className="rounded-full hover:bg-slate-100 disabled:opacity-30">
                                <ChevronRight className="w-6 h-6 text-slate-600" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
