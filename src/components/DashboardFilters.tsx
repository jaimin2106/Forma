
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, ArrowUpDown, FileText, FlaskConical } from 'lucide-react';

interface DashboardFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  typeFilter: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function DashboardFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters
}: DashboardFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-11 border-transparent bg-slate-50 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all duration-200 rounded-lg placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger className="w-full sm:w-[140px] h-11 border-transparent bg-slate-50 hover:bg-slate-100 focus:ring-2 focus:ring-violet-100 font-medium text-slate-700 rounded-lg">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="form">Forms</SelectItem>
                <SelectItem value="exam">Exams</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-[140px] h-11 border-transparent bg-slate-50 hover:bg-slate-100 focus:ring-2 focus:ring-violet-100 font-medium text-slate-700 rounded-lg">
                <Filter className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-full sm:w-[180px] h-11 border-transparent bg-slate-50 hover:bg-slate-100 focus:ring-2 focus:ring-violet-100 font-medium text-slate-700 rounded-lg">
                <ArrowUpDown className="h-4 w-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_desc">Newest First</SelectItem>
                <SelectItem value="created_asc">Oldest First</SelectItem>
                <SelectItem value="updated_desc">Recently Updated</SelectItem>
                <SelectItem value="responses_desc">Most Responses</SelectItem>
                <SelectItem value="title_asc">Title A-Z</SelectItem>
                <SelectItem value="title_desc">Title Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-11 px-4 rounded-lg font-medium transition-colors whitespace-nowrap"
          >
            <X className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
