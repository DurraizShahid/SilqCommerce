import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { orders } from '@/data/dummyData';
import { Package, Truck, CheckCircle, Clock, XCircle, Eye, Printer, CheckSquare, Square } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';
import OrderStatusBadge from '@/components/vendor/OrderStatusBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const VendorOrdersPage: React.FC = () => {
  const [vendorOrders, setVendorOrders] = useState(orders);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFulfillOpen, setIsFulfillOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { formatPrice } = useCurrency();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingNotes, setShippingNotes] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'Shipped':
        return <Truck className="h-4 w-4" />;
      case 'Processing':
        return <Package className="h-4 w-4" />;
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'default';
      case 'Shipped':
        return 'default';
      case 'Processing':
        return 'secondary';
      case 'Pending':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleViewOrder = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleFulfillOrder = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setIsFulfillOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: typeof orders[0]['status']) => {
    setVendorOrders(vendorOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleShipOrder = () => {
    if (!selectedOrder || !trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setVendorOrders(vendorOrders.map(order => 
      order.id === selectedOrder.id 
        ? { 
            ...order, 
            status: 'Shipped' as const,
            trackingNumber: trackingNumber.trim(),
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          } 
        : order
    ));
    toast.success(`Order ${selectedOrder.id} marked as shipped with tracking ${trackingNumber}`);
    setIsFulfillOpen(false);
    setTrackingNumber('');
    setShippingNotes('');
    setSelectedOrder(null);
  };

  const filteredOrders = useMemo(() => {
    return vendorOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vendorOrders, searchTerm, statusFilter]);

  const stats = {
    total: vendorOrders.length,
    pending: vendorOrders.filter(o => o.status === 'Pending').length,
    processing: vendorOrders.filter(o => o.status === 'Processing').length,
    shipped: vendorOrders.filter(o => o.status === 'Shipped').length,
    delivered: vendorOrders.filter(o => o.status === 'Delivered').length,
  };

  const totalRevenue = useMemo(() => 
    vendorOrders.reduce((sum, order) => sum + order.total, 0), 
    [vendorOrders]
  );

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const handleBulkStatusUpdate = (newStatus: typeof orders[0]['status']) => {
    if (selectedOrders.size === 0) {
      toast.error('Please select at least one order');
      return;
    }

    setVendorOrders((prev) =>
      prev.map((order) =>
        selectedOrders.has(order.id) ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`${selectedOrders.size} order(s) updated to ${newStatus}`);
    setSelectedOrders(new Set());
    setIsBulkActionOpen(false);
  };

  const handleBulkShip = () => {
    if (selectedOrders.size === 0) {
      toast.error('Please select at least one order');
      return;
    }

    // In a real app, this would open a bulk shipping dialog
    toast.success(`Bulk shipping initiated for ${selectedOrders.size} order(s)`);
    setSelectedOrders(new Set());
    setIsBulkActionOpen(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Order Management</H1>
        <P className="text-muted-foreground">Manage and fulfill customer orders</P>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shipped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {selectedOrders.size > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsBulkActionOpen(true)}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Bulk Actions ({selectedOrders.size})
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedOrders(new Set())}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.has(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <P className="text-xs text-muted-foreground">{order.customerEmail}</P>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === 'Pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'Processing')}
                          >
                            Process
                          </Button>
                        )}
                        {order.status === 'Processing' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleFulfillOrder(order)}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Ship
                          </Button>
                        )}
                        {order.status === 'Shipped' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <P className="text-muted-foreground">No orders found</P>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Order Details</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div>
                <P className="font-semibold mb-2">Customer Information</P>
                <div className="bg-muted p-4 rounded-lg space-y-1">
                  <P>{selectedOrder.customerName}</P>
                  <P className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</P>
                </div>
              </div>
              <div>
                <P className="font-semibold mb-2">Order Items</P>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <P className="font-medium">{item.productName}</P>
                        <P className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × {formatPrice(item.price)}
                        </P>
                      </div>
                      <P className="font-semibold">{formatPrice(item.price * item.quantity)}</P>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <P className="text-lg font-semibold">Total</P>
                <P className="text-2xl font-bold text-accent-gold">{formatPrice(selectedOrder.total)}</P>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Invoice
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fulfill Order Dialog */}
      <Dialog open={isFulfillOpen} onOpenChange={setIsFulfillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ship Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Enter shipping details to mark order as shipped</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="trackingNumber">Tracking Number *</Label>
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="shippingNotes">Shipping Notes (optional)</Label>
              <Textarea
                id="shippingNotes"
                placeholder="Add any additional notes..."
                value={shippingNotes}
                onChange={(e) => setShippingNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFulfillOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShipOrder}>
              <Truck className="h-4 w-4 mr-2" />
              Mark as Shipped
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Apply actions to {selectedOrders.size} selected order(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handleBulkStatusUpdate('Processing')}
              >
                <Package className="h-4 w-4 mr-2" />
                Mark as Processing
              </Button>
              <Button
                variant="outline"
                onClick={handleBulkShip}
              >
                <Truck className="h-4 w-4 mr-2" />
                Bulk Ship
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkStatusUpdate('Shipped')}
              >
                <Truck className="h-4 w-4 mr-2" />
                Mark as Shipped
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkStatusUpdate('Delivered')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Delivered
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorOrdersPage;

