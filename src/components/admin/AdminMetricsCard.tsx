import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { P, Muted } from '@/components/ui/typography';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AdminMetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const AdminMetricsCard: React.FC<AdminMetricsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend,
  description,
  className,
  variant = 'default',
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-muted-foreground';
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20';
      case 'danger':
        return 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20';
      default:
        return '';
    }
  };

  return (
    <Card className={cn(className, getVariantStyles())}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs mt-1', getTrendColor())}>
            {trend === 'up' && <TrendingUp className="h-3 w-3" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(change).toFixed(1)}%</span>
            {changeLabel && <Muted className="text-xs">{changeLabel}</Muted>}
          </div>
        )}
        {description && <Muted className="text-xs mt-1">{description}</Muted>}
      </CardContent>
    </Card>
  );
};

export default AdminMetricsCard;

