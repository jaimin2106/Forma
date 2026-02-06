import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, FileText, Users, Target } from 'lucide-react';

interface AnalyticsSummaryProps {
  totalForms: number;
  totalResponses: number;
  avgCompletionRate: number;
}

export function AnalyticsSummary({
  totalForms,
  totalResponses,
  avgCompletionRate
}: AnalyticsSummaryProps) {
  const stats = [
    {
      title: 'Forms Created',
      value: totalForms,
      icon: FileText,
      change: '+12%',
      positive: true
    },
    {
      title: 'Total Responses',
      value: totalResponses.toLocaleString(),
      icon: Users,
      change: '+23%',
      positive: true
    },
    {
      title: 'Completion Rate',
      value: `${avgCompletionRate}%`,
      icon: Target,
      change: '+5%',
      positive: true
    },
    {
      title: 'This Month',
      value: Math.floor(totalResponses * 0.3),
      icon: TrendingUp,
      change: '+18%',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <Card
          key={stat.title}
          className="group border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-violet-200 hover:bg-[rgba(139,92,246,0.02)] transition-all duration-150 ease-out rounded-xl"
        >
          <CardContent className="px-6 py-5">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                {stat.title}
              </p>
              <div className="p-2 rounded-lg bg-violet-50 text-violet-600 group-hover:bg-violet-100 group-hover:scale-110 transition-all duration-200">
                <stat.icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex items-end gap-3 mt-1">
              <p className="text-3xl font-bold text-slate-900 leading-none">
                {stat.value}
              </p>

              <div className={`flex items-center px-2 h-6 rounded-md text-[11px] font-bold ${stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
