import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercent } from '@/utils/formatters';

// ============================================
// INTERFACES TYPESCRIPT
// ============================================

interface KPICardProps {
  title: string;
  value: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// ============================================
// COMPOSANT PRESENTATIONNEL (DUMB COMPONENT)
// ============================================

export function KPICard({ title, value, trend }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="text-[#6B7280] text-sm mb-2">{title}</div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-semibold text-[#111827]">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 mb-1">
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            ) : (
              <TrendingDown className="w-4 h-4 text-[#EF4444]" />
            )}
            <span
              className={`text-sm ${
                trend.isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'
              }`}
            >
              {formatPercent(trend.value)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}