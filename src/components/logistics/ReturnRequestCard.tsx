import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { P, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { RotateCcw, Calendar, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useCurrency } from '@/context/CurrencyContext';

interface ReturnRequestCardProps {
  returnRequest: {
    id: string;
    orderNumber: string;
    customerName: string;
    productName: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'completed';
    requestedDate: string;
    refundAmount: number;
    notes?: string;
  };
  onApprove?: () => void;
  onReject?: () => void;
  onViewDetails?: () => void;
}

const ReturnRequestCard: React.FC<ReturnRequestCardProps> = ({
  returnRequest,
  onApprove,
  onReject,
  onViewDetails,
}) => {
  const { formatPrice } = useCurrency();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      approved: 'secondary',
      rejected: 'destructive',
      refunded: 'default',
      completed: 'default',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'refunded':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <RotateCcw className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(returnRequest.status)}
              <CardTitle className="text-lg">{returnRequest.orderNumber}</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(returnRequest.status)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <P className="font-semibold mb-1">{returnRequest.productName}</P>
          <Muted className="text-sm">Customer: {returnRequest.customerName}</Muted>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <Muted className="text-xs mb-1">Return Reason</Muted>
          <P className="text-sm">{returnRequest.reason}</P>
        </div>

        {returnRequest.notes && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Muted className="text-xs mb-1">Notes</Muted>
            <P className="text-sm">{returnRequest.notes}</P>
          </div>
        )}

        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <Muted className="text-sm">Refund Amount</Muted>
          </div>
          <P className="font-semibold text-lg">{formatPrice(returnRequest.refundAmount)}</P>
        </div>

        <div className="flex items-center gap-2 text-sm pt-2 border-t">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Muted>Requested: {format(new Date(returnRequest.requestedDate), 'MMM dd, yyyy')}</Muted>
        </div>

        {returnRequest.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            {onApprove && (
              <Button size="sm" onClick={onApprove} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            )}
            {onReject && (
              <Button variant="destructive" size="sm" onClick={onReject} className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            )}
          </div>
        )}

        {onViewDetails && (
          <Button variant="ghost" size="sm" onClick={onViewDetails} className="w-full">
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ReturnRequestCard;

