import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Sparkles, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateForm: () => void;
  onUseTemplate: () => void;
  title?: string;
  description?: string;
  showTemplateButton?: boolean;
}

export function EmptyState({
  onCreateForm,
  onUseTemplate,
  title = "No forms yet",
  description = "Create your first form or choose from our premium templates to get started.",
  showTemplateButton = true
}: EmptyStateProps) {
  return (
    <div className="flex justify-center py-12">
      <Card className="max-w-md w-full bg-white/50 border-dashed border-2 border-slate-200 shadow-sm">
        <CardContent className="p-10 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-violet-50 rounded-2xl flex items-center justify-center">
              <FileText className="h-8 w-8 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {title}
            </h3>
            <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
              {description}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onCreateForm}
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg shadow-sm active:scale-95 transition-all duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Form
            </Button>

            {showTemplateButton && (
              <Button
                variant="outline"
                onClick={onUseTemplate}
                className="w-full h-11 border-slate-200 hover:bg-slate-50 hover:text-violet-600 hover:border-violet-200 transition-all duration-200 font-medium text-slate-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Templates
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
