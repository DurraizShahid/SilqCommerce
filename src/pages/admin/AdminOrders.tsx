import React from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { orders } from '@/data/dummyData';
import { Eye, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminOrders: React.FC = () => {
  const handleView = (orderId: string) => {
    toast.info(`Viewing order ${orderId}`);
    // Implement actual view logic (e.g., open a detailed order modal)
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
    // Implement actual status update logic
  };

  return (
    <div className="space-y-8">
      <H1 className="mb-4">Orders Management</H1>
      <P className="text-lg text-muted-foreground">
        Track and manage customer orders.
      </P>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName} (<Muted>{order.customerEmail}</Muted>)</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleView(order.id)} className="mr-2">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {order.status !== 'Delivered' && (
                    <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(order.id, 'Delivered')} className="mr-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  {order.status !== 'Cancelled' && (
                    <Button variant="ghost" size="icon" onClick={() => handleUpdateStatus(order.id, 'Cancelled')}>
                      <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;