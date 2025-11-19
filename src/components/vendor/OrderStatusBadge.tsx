import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const getStatusVariant = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized.includes('pending') || normalized.includes('processing')) {
      return 'secondary';
    }
    if (normalized.includes('shipped') || normalized.includes('delivered') || normalized.includes('completed')) {
      return 'default';
    }
    if (normalized.includes('cancelled') || normalized.includes('refunded')) {
      return 'destructive';
    }
    return 'outline';
  };

  return (
    <Badge variant={getStatusVariant(status)} className={cn(className)}>
      {status}
    </Badge>
  );
};

export default OrderStatusBadge;

