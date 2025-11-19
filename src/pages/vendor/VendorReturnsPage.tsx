import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, CheckCircle, XCircle, Eye, Package, RotateCcw, DollarSign, AlertCircle } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ReturnRequestCard from '@/components/logistics/ReturnRequestCard';
import VendorMetricsCard from '@/components/vendor/VendorMetricsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReturnRequest {
  id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'completed';
  requestedDate: string;
  refundAmount: number;
  notes?: string;
}

const VendorReturnsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [actionNotes, setActionNotes] = useState('');

  const [returns, setReturns] = useState<ReturnRequest[]>([
    {
      id: 'ret1',
      orderNumber: 'ORD-123456',
      customerName: 'John Doe',
      productName: 'Luxury Designer Handbag',
      reason: 'Defective item',
      status: 'pending',
      requestedDate: '2023-11-15',
      refundAmount: 599.99,
      notes: 'Customer reports zipper is broken',
    },
    {
      id: 'ret2',
      orderNumber: 'ORD-123457',
      customerName: 'Jane Smith',
      productName: 'Premium Leather Wallet',
      reason: 'Wrong size',
      status: 'approved',
      requestedDate: '2023-11-10',
      refundAmount: 149.99,
    },
    {
      id: 'ret3',
      orderNumber: 'ORD-123458',
      customerName: 'Bob Johnson',
      productName: 'Designer Sunglasses',
      reason: 'Changed mind',
      status: 'refunded',
      requestedDate: '2023-11-05',
      refundAmount: 299.99,
    },
  ]);

  const filteredReturns = returns.filter((returnReq) => {
    const matchesSearch =
      returnReq.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnReq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnReq.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || returnReq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const returnMetrics = useMemo(() => {
    const pending = returns.filter((r) => r.status === 'pending').length;
    const approved = returns.filter((r) => r.status === 'approved').length;
    const refunded = returns.filter((r) => r.status === 'refunded').length;
    const totalAmount = returns
      .filter((r) => r.status === 'refunded' || r.status === 'approved')
      .reduce((sum, r) => sum + r.refundAmount, 0);
    
    return {
      pending,
      approved,
      refunded,
      totalAmount,
      total: returns.length,
    };
  }, [returns]);

  const handleApprove = (returnReq: ReturnRequest) => {
    setSelectedReturn(returnReq);
    setActionType('approve');
    setIsActionDialogOpen(true);
  };

  const handleReject = (returnReq: ReturnRequest) => {
    setSelectedReturn(returnReq);
    setActionType('reject');
    setIsActionDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedReturn) return;

    if (actionType === 'approve') {
      setReturns((prev) =>
        prev.map((r) =>
          r.id === selectedReturn.id ? { ...r, status: 'approved', notes: actionNotes } : r
        )
      );
      toast.success('Return request approved');
    } else {
      setReturns((prev) =>
        prev.map((r) =>
          r.id === selectedReturn.id ? { ...r, status: 'rejected', notes: actionNotes } : r
        )
      );
      toast.success('Return request rejected');
    }
    setIsActionDialogOpen(false);
    setActionNotes('');
    setSelectedReturn(null);
  };

  const getStatusBadge = (status: ReturnRequest['status']) => {
    const variants: Record<ReturnRequest['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'outline',
      approved: 'secondary',
      rejected: 'destructive',
      refunded: 'default',
      completed: 'default',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Returns Management</H1>
          <P className="text-muted-foreground">Manage customer return requests</P>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <VendorMetricsCard
          title="Total Returns"
          value={returnMetrics.total}
          icon={RotateCcw}
          description="All return requests"
        />
        <VendorMetricsCard
          title="Pending"
          value={returnMetrics.pending}
          icon={AlertCircle}
          description="Awaiting review"
        />
        <VendorMetricsCard
          title="Approved"
          value={returnMetrics.approved}
          icon={CheckCircle}
          description="Approved returns"
        />
        <VendorMetricsCard
          title="Total Refunded"
          value={formatPrice(returnMetrics.totalAmount)}
          icon={DollarSign}
          description="Refund amount"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search returns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Returns Display */}
      {viewMode === 'grid' ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({filteredReturns.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({returnMetrics.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({returnMetrics.approved})</TabsTrigger>
            <TabsTrigger value="refunded">Refunded ({returnMetrics.refunded})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReturns.map((returnReq) => (
                <ReturnRequestCard
                  key={returnReq.id}
                  returnRequest={returnReq}
                  onApprove={() => handleApprove(returnReq)}
                  onReject={() => handleReject(returnReq)}
                  onViewDetails={() => {
                    setSelectedReturn(returnReq);
                    setIsDetailDialogOpen(true);
                  }}
                />
              ))}
            </div>
            {filteredReturns.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <RotateCcw className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <P className="text-lg text-muted-foreground">No return requests found.</P>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReturns.filter(r => r.status === 'pending').map((returnReq) => (
                <ReturnRequestCard
                  key={returnReq.id}
                  returnRequest={returnReq}
                  onApprove={() => handleApprove(returnReq)}
                  onReject={() => handleReject(returnReq)}
                  onViewDetails={() => {
                    setSelectedReturn(returnReq);
                    setIsDetailDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReturns.filter(r => r.status === 'approved').map((returnReq) => (
                <ReturnRequestCard
                  key={returnReq.id}
                  returnRequest={returnReq}
                  onViewDetails={() => {
                    setSelectedReturn(returnReq);
                    setIsDetailDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="refunded" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredReturns.filter(r => r.status === 'refunded').map((returnReq) => (
                <ReturnRequestCard
                  key={returnReq.id}
                  returnRequest={returnReq}
                  onViewDetails={() => {
                    setSelectedReturn(returnReq);
                    setIsDetailDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Return Requests</CardTitle>
            <CardDescription>View and manage all return requests</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns.map((returnReq) => (
                  <TableRow key={returnReq.id}>
                    <TableCell className="font-medium">{returnReq.orderNumber}</TableCell>
                    <TableCell>{returnReq.customerName}</TableCell>
                    <TableCell>{returnReq.productName}</TableCell>
                    <TableCell>{returnReq.reason}</TableCell>
                    <TableCell>{formatPrice(returnReq.refundAmount)}</TableCell>
                    <TableCell>{getStatusBadge(returnReq.status)}</TableCell>
                    <TableCell>
                      {format(new Date(returnReq.requestedDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReturn(returnReq);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {returnReq.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(returnReq)}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(returnReq)}
                              className="text-red-600"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredReturns.length === 0 && (
              <div className="py-12 text-center">
                <P className="text-muted-foreground">No return requests found matching your filters.</P>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Request Details</DialogTitle>
            <DialogDescription>
              View complete return request information
            </DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Number</Label>
                  <P className="font-semibold">{selectedReturn.orderNumber}</P>
                </div>
                <div>
                  <Label>Customer</Label>
                  <P className="font-semibold">{selectedReturn.customerName}</P>
                </div>
                <div>
                  <Label>Product</Label>
                  <P className="font-semibold">{selectedReturn.productName}</P>
                </div>
                <div>
                  <Label>Refund Amount</Label>
                  <P className="font-semibold">{formatPrice(selectedReturn.refundAmount)}</P>
                </div>
                <div>
                  <Label>Reason</Label>
                  <P className="font-semibold">{selectedReturn.reason}</P>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedReturn.status)}</div>
                </div>
              </div>
              {selectedReturn.notes && (
                <div>
                  <Label>Notes</Label>
                  <P className="text-sm text-muted-foreground">{selectedReturn.notes}</P>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Return Request' : 'Reject Return Request'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Approve this return request and process refund'
                : 'Reject this return request with a reason'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedReturn && (
              <div className="bg-muted p-4 rounded-lg">
                <P className="text-sm font-semibold mb-1">{selectedReturn.productName}</P>
                <P className="text-sm text-muted-foreground">
                  Order: {selectedReturn.orderNumber} • Refund: {formatPrice(selectedReturn.refundAmount)}
                </P>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="actionNotes">
                {actionType === 'approve' ? 'Notes (optional)' : 'Rejection Reason *'}
              </Label>
              <Textarea
                id="actionNotes"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={3}
                placeholder={
                  actionType === 'approve'
                    ? 'Add any notes about this approval...'
                    : 'Explain why this return is being rejected...'
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
              disabled={actionType === 'reject' && !actionNotes.trim()}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'} Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorReturnsPage;

