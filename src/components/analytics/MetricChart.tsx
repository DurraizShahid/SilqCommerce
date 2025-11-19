import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { P, Muted } from '@/components/ui/typography';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricChartProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  children?: React.ReactNode;
  className?: string;
}

const MetricChart: React.FC<MetricChartProps> = ({
  title,
  value,
  change,
  changeLabel,
  description,
  trend,
  children,
  className = '',
}) => {
  const getTrendColor = () => {
    if (trend === 'up' || (change !== undefined && change >= 0)) {
      return 'text-green-600';
    }
    if (trend === 'down' || (change !== undefined && change < 0)) {
      return 'text-red-600';
    }
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up' || (change !== undefined && change >= 0)) {
      return <TrendingUp className="h-4 w-4" />;
    }
    if (trend === 'down' || (change !== undefined && change < 0)) {
      return <TrendingDown className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm mt-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
              {changeLabel && (
                <Muted className="text-xs ml-1">{changeLabel}</Muted>
              )}
            </div>
          )}
        </div>
        {children && (
          <div className="h-[200px] flex items-center justify-center">
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricChart;

