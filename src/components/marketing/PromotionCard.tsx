import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { P, Muted } from '@/components/ui/typography';
import { Clock, Tag, TrendingUp, Users, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useCurrency } from '@/context/CurrencyContext';
import { Progress } from '@/components/ui/progress';

interface PromotionCardProps {
  promotion: {
    id: string;
    name: string;
    type: 'coupon' | 'flash-sale' | 'discount';
    code?: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    startDate: string;
    endDate: string;
    status: 'active' | 'scheduled' | 'expired' | 'paused';
    minPurchase?: number;
    maxDiscount?: number;
    usageLimit?: number;
    usedCount: number;
    revenue?: number;
    orders?: number;
  };
  onClick?: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, onClick }) => {
  const { formatPrice } = useCurrency();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      scheduled: 'secondary',
      expired: 'outline',
      paused: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coupon':
        return <Tag className="h-4 w-4" />;
      case 'flash-sale':
        return <Clock className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const usagePercentage = promotion.usageLimit 
    ? (promotion.usedCount / promotion.usageLimit) * 100 
    : 0;

  const isActive = promotion.status === 'active';
  const isScheduled = promotion.status === 'scheduled';
  const isExpired = promotion.status === 'expired';

  const discountDisplay = promotion.discountType === 'percentage'
    ? `${promotion.discount}% OFF`
    : `${formatPrice(promotion.discount)} OFF`;

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? '' : ''} ${
        isActive ? 'border-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(promotion.type)}
              <CardTitle className="text-lg">{promotion.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(promotion.status)}
              <Badge variant="outline" className="font-semibold text-primary">
                {discountDisplay}
              </Badge>
              {promotion.code && (
                <Badge variant="secondary" className="font-mono">
                  {promotion.code}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <Muted>Usage</Muted>
            <P className="font-semibold">
              {promotion.usedCount.toLocaleString()}
              {promotion.usageLimit && ` / ${promotion.usageLimit.toLocaleString()}`}
            </P>
          </div>
          {promotion.usageLimit && (
            <Progress value={usagePercentage} className="h-2" />
          )}
        </div>

        {promotion.revenue && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <Muted className="text-sm">Revenue</Muted>
            </div>
            <P className="font-semibold">{formatPrice(promotion.revenue)}</P>
          </div>
        )}

        {promotion.orders && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <Muted className="text-sm">Orders</Muted>
            </div>
            <P className="font-semibold">{promotion.orders}</P>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {isScheduled && 'Starts '}
              {isExpired && 'Ended '}
              {isActive && 'Ends '}
              {formatDistanceToNow(new Date(isExpired ? promotion.endDate : promotion.endDate), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;

