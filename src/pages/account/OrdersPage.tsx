import React from 'react';
import { H1, P } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { orders } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { Eye, Package } from 'lucide-react';

const OrdersPage: React.FC = () => {
  const { formatPrice } = useCurrency();

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

  return (
    <div className="space-y-8">
      <div>
        <H1>Order History</H1>
        <P className="text-muted-foreground">View and track your past orders</P>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-4">You haven't placed any orders yet.</P>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <P className="text-sm text-muted-foreground mt-1">
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </P>
                  </div>
                  <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <P className="font-semibold mb-2">Items:</P>
                    <ul className="space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {item.quantity}x {item.productName} - {formatPrice(item.price)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <P className="font-semibold text-lg">Total: {formatPrice(order.total)}</P>
                    <div className="flex gap-2">
                      <Link to={`/account/orders/${order.id}/track`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Track Order
                        </Button>
                      </Link>
                      {order.status === 'Delivered' && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

