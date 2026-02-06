import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  MoreHorizontal,
  Edit3,
  Eye,
  BarChart2,
  Trash2,
  Share2,
  Clock,
  QrCode
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { FormShare } from '@/components/FormShare';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type Form = Tables<'forms'> & {
  is_quiz?: boolean;
  question_count?: number;
  response_count?: number;
};

interface PremiumFormCardProps {
  form: Form;
  onDelete: (formId: string) => void;
}

export function PremiumFormCard({ form, onDelete }: PremiumFormCardProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleDelete = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm('Are you sure? This will permanently delete the form and all responses.')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase.from('forms').delete().eq('id', form.id);
      if (error) throw error;
      onDelete(form.id);
      toast({ title: "Deleted", description: "Form moved to trash." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Could not delete form.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const statusColors = {
    published: "bg-emerald-100 text-emerald-700 border-emerald-200",
    draft: "bg-slate-100 text-slate-600 border-slate-200",
    closed: "bg-rose-100 text-rose-700 border-rose-200"
  };

  const isExam = form.is_quiz;

  return (
    <>
      <Card
        onClick={() => navigate(`/forms/${form.id}/edit`)}
        className="group relative border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(139,92,246,0.12)] hover:border-violet-500 hover:-translate-y-[2px] transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-xl flex flex-col h-full overflow-hidden cursor-pointer"
      >
        {/* Top Decor Bar */}
        <div className={cn(
          "absolute top-0 left-0 w-full h-1",
          isExam ? "bg-gradient-to-r from-violet-500 to-fuchsia-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"
        )} />

        <CardHeader className="p-5 pb-2 pt-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border", statusColors[form.status as keyof typeof statusColors] || statusColors.draft)}>
                  {form.status}
                </Badge>
                {isExam && (
                  <Badge variant="outline" className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-violet-600 border-violet-100 rounded-md">
                    Exam Mode
                  </Badge>
                )}
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 leading-tight line-clamp-1 group-hover:text-violet-600 transition-colors">
                {form.title}
              </h3>
              <p className="text-[14px] text-slate-500 line-clamp-2 min-h-[2.6em] leading-[1.4]">
                {form.description || "No description provided."}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg focus-visible:ring-2 focus-visible:ring-violet-500">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/forms/${form.id}/edit`); }} className="cursor-pointer">
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShowShareDialog(true); }} className="cursor-pointer">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-rose-600 focus:text-rose-600 cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-2 flex-grow flex flex-col justify-end">
          {/* Metrics Row */}
          <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
            <div className="flex gap-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[16px] font-bold text-slate-900">{form.response_count || 0}</span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Responses</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[16px] font-bold text-slate-900">{form.question_count || 0}</span>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Questions</span>
              </div>
            </div>

            <div className="flex items-center text-[13px] text-slate-400 gap-1.5" title={`Created: ${new Date(form.created_at).toLocaleDateString()}`}>
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(new Date(form.created_at))} ago</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={() => navigate(`/forms/${form.id}/edit`)}
            variant="default"
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:shadow-md rounded-lg h-10 font-semibold text-sm transition-all"
          >
            Edit Form
          </Button>

          <Button onClick={() => navigate(`/forms/${form.id}/view`)} variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-slate-500 hover:bg-violet-50 hover:text-violet-600 border border-transparent hover:border-violet-100 transition-all" title="View">
            <Eye className="h-4 w-4" />
          </Button>

          <Button onClick={() => navigate(`/forms/${form.id}/responses`)} variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-slate-500 hover:bg-violet-50 hover:text-violet-600 border border-transparent hover:border-violet-100 transition-all" title="Analytics">
            <BarChart2 className="h-4 w-4" />
          </Button>

          <Button onClick={() => setShowShareDialog(true)} variant="ghost" size="icon" className="h-10 w-10 rounded-lg text-slate-500 hover:bg-violet-50 hover:text-violet-600 border border-transparent hover:border-violet-100 transition-all" title="Share">
            <QrCode className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share "{form.title}"</DialogTitle>
            <DialogDescription>
              Share this form with your audience via link or QR code.
            </DialogDescription>
          </DialogHeader>
          <FormShare formId={form.id} formTitle={form.title} />
        </DialogContent>
      </Dialog>
    </>
  );
}
