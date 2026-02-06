import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import {
  Eye,
  Edit,
  Trash2,
  QrCode,
  BarChart3,
  Copy,
  Calendar,
  Users,
  MessageSquare,
  MoreHorizontal,
  FileText,
  FlaskConical
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

type Form = Tables<'forms'> & {
  is_quiz?: boolean;
  question_count?: number;
  response_count?: number;
};

interface EnhancedFormCardProps {
  form: Form;
  onDelete: (formId: string) => void;
  colorIndex?: number;
}

export function EnhancedFormCard({ form, onDelete, colorIndex = 0 }: EnhancedFormCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', form.id);
      if (error) throw error;
      onDelete(form.id);
      toast({
        title: "Success",
        description: "Form deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting form:', error);
      toast({
        title: "Error",
        description: "Failed to delete form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const copyFormLink = () => {
    const url = `${window.location.origin}/forms/${form.id}/view`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Form link copied to clipboard.",
    });
  };

  // Super light soft pastel colors
  const pastelColors = [
    "#F3E8FF", // lavender
    "#E5F5FF", // blue
    "#FFFDE2", // yellow
    "#E6F4EA", // mint
    "#FFE0E6", // pink
    "#FFF3E0", // orange
    "#F1FFF0", // green
    "#FEF6E6", // light orange
    "#E6FFF7", // aqua
    "#F3FFD4", // lime
  ];

  // Card size fixed (responsive, grid friendly)
  const cardBgClass = `bg-[${pastelColors[colorIndex % pastelColors.length]}]`;
  const cardBorderClass = `border-2 border-white/60 shadow-[0_4px_32px_0_rgba(152,152,152,0.05)]`;
  const cardSizeClass = "w-full max-w-[340px] min-h-[320px] flex flex-col justify-between"; // put this for each card for same size

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'closed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-2xl hover:-translate-y-2 rounded-3xl overflow-hidden ${cardBgClass} ${cardBorderClass} ${cardSizeClass}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {form.is_quiz ? (
                <FlaskConical className="h-5 w-5 text-purple-400" />
              ) : (
                <FileText className="h-5 w-5 text-blue-400" />
              )}
              <span className="font-bold text-lg sm:text-xl text-[#292850] tracking-tight line-clamp-1">
                {form.title}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                variant={getStatusVariant(form.status)}
                className="capitalize px-3 py-1 text-xs font-semibold rounded-full bg-white/60 text-[#575A7B] border-none shadow"
              >
                {form.status}
              </Badge>
              {form.is_quiz && (
                <Badge
                  variant="outline"
                  className="rounded-full px-3 py-1 text-purple-500 border-purple-200 bg-white/60 shadow"
                >
                  🧪 Quiz Mode
                </Badge>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/forms/${form.id}/edit`} className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit {form.is_quiz ? 'Exam' : 'Form'}
                </Link>
              </DropdownMenuItem>
              {form.status === 'published' && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={`/forms/${form.id}/view`} className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/forms/${form.id}/responses`} className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Results
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyFormLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {form.description && (
          <p className="text-sm text-[#757575] line-clamp-2 mt-2">{form.description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-[#888] mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-green-400" />
              {formatDate(form.created_at)}
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-pink-400" />
              {form.question_count || 0} questions
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-blue-400" />
              {form.response_count || 0} responses
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            asChild
            className="flex-1 bg-white/80 rounded-full shadow border border-blue-100 text-blue-600 font-medium hover:bg-blue-50 transition"
          >
            <Link to={`/forms/${form.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          {form.status === 'published' && (
            <>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="rounded-full bg-white/80 shadow border text-purple-600 hover:bg-purple-50 transition"
              >
                <Link to={`/forms/${form.id}/view`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full bg-white/80 shadow border text-green-600 hover:bg-green-50 transition"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm sm:max-w-md p-5 rounded-2xl bg-white/85 backdrop-blur-lg shadow-xl">
                  <DialogHeader className="pb-0">
                    <DialogTitle>Share "{form.title}"</DialogTitle>
                    <DialogDescription className="text-xs">Copy the link or share the QR code.</DialogDescription>
                  </DialogHeader>
                  <FormShare formId={form.id} formTitle={form.title} />
                </DialogContent>
              </Dialog>
              <Button
                size="sm"
                variant="outline"
                asChild
                className="rounded-full bg-white/80 shadow border text-pink-600 hover:bg-pink-50 transition"
              >
                <Link to={`/forms/${form.id}/responses`}>
                  <BarChart3 className="h-4 w-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
