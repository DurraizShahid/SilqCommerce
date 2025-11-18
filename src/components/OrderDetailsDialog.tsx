import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order, Product } from '@/data/dummyData';
import { P, Large, Muted } from '@/components/ui/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Order Details (ID: {order.id})</DialogTitle>
          <DialogDescription>
            Detailed information about this customer order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Large>Customer Name:</Large>
              <P className="[&:not(:first-child)]:mt-0">{order.customerName}</P>
            </div>
            <div>
              <Large>Customer Email:</Large>
              <P className="[&:not(:first-child)]:mt-0">{order.customerEmail}</P>
            </div>
            <div>
              <Large>Order Date:</Large>
              <P className="[&:not(:first-child)]:mt-0">{order.orderDate}</P>
            </div>
            <div>
              <Large>Status:</Large>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold [&:not(:first-child)]:mt-0 ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>

          <Large className="mt-4">Items:</Large>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-right text-xl font-bold mt-4">
            Total: ${order.total.toFixed(2)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;