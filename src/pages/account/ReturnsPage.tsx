import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { returnRequests, orders } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { Package, RotateCcw, Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ReturnsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [userReturns, setUserReturns] = useState(returnRequests);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [returnReason, setReturnReason] = useState('');
  const userOrders = orders; // In real app, filter by current user

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'refunded':
        return 'default';
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleCreateReturn = () => {
    if (!selectedOrder || !selectedProduct || !returnReason) {
      toast.error('Please fill in all fields');
      return;
    }

    const order = userOrders.find((o) => o.id === selectedOrder);
    const product = order?.items.find((item) => item.productId === selectedProduct);

    if (!order || !product) {
      toast.error('Invalid selection');
      return;
    }

    const newReturn = {
      id: `return-${Date.now()}`,
      orderId: selectedOrder,
      productId: selectedProduct,
      productName: product.productName,
      customerId: 'customer1',
      reason: returnReason,
      status: 'pending' as const,
      requestedAt: new Date().toISOString().split('T')[0],
      refundAmount: product.price * product.quantity,
    };

    setUserReturns([newReturn, ...userReturns]);
    toast.success('Return request submitted successfully');
    setIsCreateDialogOpen(false);
    setSelectedOrder('');
    setSelectedProduct('');
    setReturnReason('');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Returns & Refunds</H1>
          <P className="text-muted-foreground">Request returns for your orders</P>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Request Return
        </Button>
      </div>

      {userReturns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RotateCcw className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-4">You don't have any return requests.</P>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Request a Return</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Return Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userReturns.map((returnRequest) => (
                  <TableRow key={returnRequest.id}>
                    <TableCell className="font-medium">{returnRequest.productName}</TableCell>
                    <TableCell>#{returnRequest.orderId}</TableCell>
                    <TableCell>{returnRequest.reason}</TableCell>
                    <TableCell>{formatPrice(returnRequest.refundAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(returnRequest.status)}>
                        {returnRequest.status.charAt(0).toUpperCase() + returnRequest.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(returnRequest.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {returnRequest.trackingNumber && (
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Track Return
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Return Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request a Return</DialogTitle>
            <DialogDescription>Select an order and product to return</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order">Select Order *</Label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an order" />
                </SelectTrigger>
                <SelectContent>
                  {userOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      Order #{order.id} - {new Date(order.orderDate).toLocaleDateString()} - {formatPrice(order.total)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedOrder && (
              <div className="space-y-2">
                <Label htmlFor="product">Select Product *</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOrders
                      .find((o) => o.id === selectedOrder)
                      ?.items.map((item) => (
                        <SelectItem key={item.productId} value={item.productId}>
                          {item.productName} (Qty: {item.quantity}) - {formatPrice(item.price)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reason">Return Reason *</Label>
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Size doesn't fit">Size doesn't fit</SelectItem>
                  <SelectItem value="Wrong item received">Wrong item received</SelectItem>
                  <SelectItem value="Defective/Damaged">Defective/Damaged</SelectItem>
                  <SelectItem value="Not as described">Not as described</SelectItem>
                  <SelectItem value="Changed my mind">Changed my mind</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReturn}>Submit Return Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReturnsPage;

