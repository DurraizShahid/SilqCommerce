import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { P, Muted } from '@/components/ui/typography';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendorMetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
}

const VendorMetricsCard: React.FC<VendorMetricsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend,
  description,
  className,
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs mt-1', getTrendColor())}>
            {change > 0 && <span>↑</span>}
            {change < 0 && <span>↓</span>}
            <span>{Math.abs(change)}%</span>
            {changeLabel && <Muted className="text-xs">{changeLabel}</Muted>}
          </div>
        )}
        {description && <Muted className="text-xs mt-1">{description}</Muted>}
      </CardContent>
    </Card>
  );
};

export default VendorMetricsCard;

