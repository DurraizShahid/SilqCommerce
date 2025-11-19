import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { P, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Package, Truck, MapPin, Calendar, Copy, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ShippingOrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    productName: string;
    shippingAddress: string;
    shippingMethod: string;
    status: 'pending' | 'ready' | 'shipped' | 'delivered';
    orderDate: string;
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
  };
  onPrintLabel?: () => void;
  onMarkShipped?: () => void;
  onViewDetails?: () => void;
}

const ShippingOrderCard: React.FC<ShippingOrderCardProps> = ({
  order,
  onPrintLabel,
  onMarkShipped,
  onViewDetails,
}) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      ready: 'secondary',
      shipped: 'default',
      delivered: 'default',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-4 w-4" />;
      case 'ready':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleCopyTracking = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success('Tracking number copied to clipboard');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(order.status)}
              <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(order.status)}
              <Badge variant="outline">{order.shippingMethod}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <P className="font-semibold mb-1">{order.productName}</P>
          <Muted className="text-sm">Customer: {order.customerName}</Muted>
        </div>

        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1">
            <Muted className="text-xs mb-1">Shipping Address</Muted>
            <P className="text-sm">{order.shippingAddress}</P>
          </div>
        </div>

        {order.trackingNumber && (
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <div className="flex-1">
              <Muted className="text-xs mb-1">Tracking Number</Muted>
              <div className="flex items-center gap-2">
                <P className="text-sm font-mono">{order.trackingNumber}</P>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleCopyTracking}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {order.carrier && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => {
                      // In real app, this would open carrier tracking page
                      toast.info('Opening carrier tracking page...');
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Track
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {order.estimatedDelivery && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Muted>Est. Delivery: {format(new Date(order.estimatedDelivery), 'MMM dd, yyyy')}</Muted>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t">
          <Muted className="text-xs">Order Date: {format(new Date(order.orderDate), 'MMM dd, yyyy')}</Muted>
        </div>

        <div className="flex gap-2 pt-2">
          {order.status === 'ready' && (
            <>
              {onPrintLabel && (
                <Button variant="outline" size="sm" onClick={onPrintLabel} className="flex-1">
                  <Package className="h-4 w-4 mr-2" />
                  Print Label
                </Button>
              )}
              {onMarkShipped && (
                <Button size="sm" onClick={onMarkShipped} className="flex-1">
                  <Truck className="h-4 w-4 mr-2" />
                  Mark Shipped
                </Button>
              )}
            </>
          )}
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={onViewDetails} className="flex-1">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShippingOrderCard;

