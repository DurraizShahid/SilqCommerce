import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Package, Truck, Printer, Download, Search, Filter, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ShippingOrderCard from '@/components/logistics/ShippingOrderCard';
import VendorMetricsCard from '@/components/vendor/VendorMetricsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShippingOrder {
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
}

const VendorShippingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<ShippingOrder | null>(null);
  const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const [orders, setOrders] = useState<ShippingOrder[]>([
    {
      id: 'so1',
      orderNumber: 'ORD-123456',
      customerName: 'John Doe',
      productName: 'Luxury Designer Handbag',
      shippingAddress: '123 Main St, New York, NY 10001',
      shippingMethod: 'Express',
      status: 'ready',
      orderDate: '2023-11-15',
      carrier: 'FedEx',
      estimatedDelivery: '2023-11-18',
    },
    {
      id: 'so2',
      orderNumber: 'ORD-123457',
      customerName: 'Jane Smith',
      productName: 'Premium Leather Wallet',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      shippingMethod: 'Standard',
      status: 'shipped',
      orderDate: '2023-11-14',
      trackingNumber: 'TRACK123456789',
      carrier: 'UPS',
      estimatedDelivery: '2023-11-20',
    },
    {
      id: 'so3',
      orderNumber: 'ORD-123458',
      customerName: 'Bob Johnson',
      productName: 'Designer Sunglasses',
      shippingAddress: '789 Pine Rd, Chicago, IL 60601',
      shippingMethod: 'Standard',
      status: 'pending',
      orderDate: '2023-11-16',
    },
    {
      id: 'so4',
      orderNumber: 'ORD-123459',
      customerName: 'Alice Williams',
      productName: 'Luxury Watch',
      shippingAddress: '321 Elm St, Miami, FL 33101',
      shippingMethod: 'Overnight',
      status: 'delivered',
      orderDate: '2023-11-10',
      trackingNumber: 'TRACK987654321',
      carrier: 'DHL',
      estimatedDelivery: '2023-11-11',
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const shippingMetrics = useMemo(() => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const ready = orders.filter(o => o.status === 'ready').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    
    return {
      pending,
      ready,
      shipped,
      delivered,
      total: orders.length,
    };
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrintLabel = (order: ShippingOrder) => {
    setSelectedOrder(order);
    setIsLabelDialogOpen(true);
  };

  const handleMarkShipped = (order: ShippingOrder) => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, status: 'shipped', trackingNumber, carrier: selectedOrder?.carrier, estimatedDelivery: selectedOrder?.estimatedDelivery }
          : o
      )
    );
    toast.success('Order marked as shipped');
    setIsLabelDialogOpen(false);
    setTrackingNumber('');
    setSelectedOrder(null);
  };

  const handleMarkReady = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'ready' } : o))
    );
    toast.success('Order marked as ready to ship');
  };

  const getStatusBadge = (status: ShippingOrder['status']) => {
    const variants: Record<ShippingOrder['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
      pending: 'outline',
      ready: 'secondary',
      shipped: 'default',
      delivered: 'default',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Shipping Management</H1>
          <P className="text-muted-foreground">Manage order fulfillment and shipping</P>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <VendorMetricsCard
          title="Total Orders"
          value={shippingMetrics.total}
          icon={Package}
          description="All orders"
        />
        <VendorMetricsCard
          title="Pending"
          value={shippingMetrics.pending}
          icon={Clock}
          description="Awaiting processing"
        />
        <VendorMetricsCard
          title="Ready to Ship"
          value={shippingMetrics.ready}
          icon={Package}
          description="Ready for shipment"
        />
        <VendorMetricsCard
          title="Shipped"
          value={shippingMetrics.shipped}
          icon={Truck}
          description="In transit"
        />
        <VendorMetricsCard
          title="Delivered"
          value={shippingMetrics.delivered}
          icon={CheckCircle}
          description="Completed"
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
                    placeholder="Search orders..."
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
                  <SelectItem value="ready">Ready to Ship</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
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

      {/* Orders Display */}
      {viewMode === 'grid' ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All ({filteredOrders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({shippingMetrics.pending})</TabsTrigger>
            <TabsTrigger value="ready">Ready ({shippingMetrics.ready})</TabsTrigger>
            <TabsTrigger value="shipped">Shipped ({shippingMetrics.shipped})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.map((order) => (
                <ShippingOrderCard
                  key={order.id}
                  order={order}
                  onPrintLabel={() => handlePrintLabel(order)}
                  onMarkShipped={() => {
                    setSelectedOrder(order);
                    setIsLabelDialogOpen(true);
                  }}
                />
              ))}
            </div>
            {filteredOrders.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <P className="text-lg text-muted-foreground">No orders found.</P>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.filter(o => o.status === 'pending').map((order) => (
                <ShippingOrderCard
                  key={order.id}
                  order={order}
                  onPrintLabel={() => handlePrintLabel(order)}
                  onMarkShipped={() => {
                    setSelectedOrder(order);
                    setIsLabelDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ready" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.filter(o => o.status === 'ready').map((order) => (
                <ShippingOrderCard
                  key={order.id}
                  order={order}
                  onPrintLabel={() => handlePrintLabel(order)}
                  onMarkShipped={() => {
                    setSelectedOrder(order);
                    setIsLabelDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shipped" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredOrders.filter(o => o.status === 'shipped' || o.status === 'delivered').map((order) => (
                <ShippingOrderCard
                  key={order.id}
                  order={order}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Orders to Ship</CardTitle>
            <CardDescription>View and manage all shipping orders</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Shipping Address</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {order.shippingAddress}
                    </TableCell>
                    <TableCell>{order.shippingMethod}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {order.trackingNumber ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {order.trackingNumber}
                          </Badge>
                          {order.carrier && (
                            <Badge variant="secondary" className="text-xs">
                              {order.carrier}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Muted>-</Muted>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkReady(order.id)}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintLabel(order)}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Print Label
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredOrders.length === 0 && (
              <div className="py-12 text-center">
                <P className="text-muted-foreground">No orders found matching your filters.</P>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Print Label / Mark Shipped Dialog */}
      <Dialog open={isLabelDialogOpen} onOpenChange={setIsLabelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ship Order</DialogTitle>
            <DialogDescription>
              Print shipping label and mark order as shipped
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Order Number</Label>
                <P className="font-semibold">{selectedOrder.orderNumber}</P>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carrier">Carrier</Label>
                  <Select
                    value={selectedOrder?.carrier || ''}
                    onValueChange={(value) => {
                      if (selectedOrder) {
                        setSelectedOrder({ ...selectedOrder, carrier: value });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FedEx">FedEx</SelectItem>
                      <SelectItem value="UPS">UPS</SelectItem>
                      <SelectItem value="DHL">DHL</SelectItem>
                      <SelectItem value="USPS">USPS</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Tracking Number *</Label>
                  <Input
                    id="trackingNumber"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                <Input
                  id="estimatedDelivery"
                  type="date"
                  value={selectedOrder?.estimatedDelivery?.split('T')[0] || ''}
                  onChange={(e) => {
                    if (selectedOrder) {
                      setSelectedOrder({ ...selectedOrder, estimatedDelivery: e.target.value });
                    }
                  }}
                />
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <P className="text-sm font-semibold mb-2">Shipping Details:</P>
                <P className="text-sm text-muted-foreground">
                  {selectedOrder.shippingAddress}
                </P>
                <P className="text-sm text-muted-foreground">
                  Method: {selectedOrder.shippingMethod}
                </P>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLabelDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.success('Shipping label printed');
              }}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Label
            </Button>
            <Button
              onClick={() => selectedOrder && handleMarkShipped(selectedOrder)}
              disabled={!trackingNumber.trim()}
            >
              <Truck className="h-4 w-4 mr-2" />
              Mark as Shipped
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorShippingPage;

