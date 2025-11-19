import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { orders } from '@/data/dummyData';
import { format } from 'date-fns';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
  completed: boolean;
}

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { formatPrice } = useCurrency();
  const order = orders.find((o) => o.id === orderId);

  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([
    {
      id: 'e1',
      status: 'ordered',
      description: 'Order placed',
      timestamp: '2023-11-15T10:00:00Z',
      completed: true,
    },
    {
      id: 'e2',
      status: 'confirmed',
      description: 'Order confirmed',
      timestamp: '2023-11-15T10:15:00Z',
      completed: true,
    },
    {
      id: 'e3',
      status: 'processing',
      description: 'Order being prepared',
      location: 'Warehouse',
      timestamp: '2023-11-15T14:30:00Z',
      completed: true,
    },
    {
      id: 'e4',
      status: 'shipped',
      description: 'Order shipped',
      location: 'New York, NY',
      timestamp: '2023-11-16T09:00:00Z',
      completed: true,
    },
    {
      id: 'e5',
      status: 'in_transit',
      description: 'In transit to destination',
      location: 'Philadelphia, PA',
      timestamp: '2023-11-17T12:00:00Z',
      completed: true,
    },
    {
      id: 'e6',
      status: 'out_for_delivery',
      description: 'Out for delivery',
      location: 'Los Angeles, CA',
      timestamp: '2023-11-18T08:00:00Z',
      completed: false,
    },
    {
      id: 'e7',
      status: 'delivered',
      description: 'Delivered',
      location: 'Los Angeles, CA',
      timestamp: '',
      completed: false,
    },
  ]);

  if (!order) {
    return (
      <div className="text-center py-16">
        <H1>Order Not Found</H1>
        <P className="text-muted-foreground">The order you're looking for doesn't exist.</P>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ordered':
      case 'confirmed':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
      case 'in_transit':
      case 'out_for_delivery':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (completed: boolean, isCurrent: boolean) => {
    if (completed) return 'text-green-600 bg-green-100';
    if (isCurrent) return 'text-blue-600 bg-blue-100';
    return 'text-gray-400 bg-gray-100';
  };

  const currentEventIndex = trackingEvents.findIndex((e) => !e.completed);
  const currentEvent = currentEventIndex > 0 ? trackingEvents[currentEventIndex - 1] : trackingEvents[0];

  return (
    <div className="space-y-8">
      <div>
        <H1>Order Tracking</H1>
        <P className="text-muted-foreground">Track your order #{order.id}</P>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Muted className="text-sm">Order Number</Muted>
              <P className="font-semibold">{order.id}</P>
            </div>
            <div>
              <Muted className="text-sm">Order Date</Muted>
              <P className="font-semibold">
                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
              </P>
            </div>
            <div>
              <Muted className="text-sm">Total Amount</Muted>
              <P className="font-semibold">{formatPrice(order.total)}</P>
            </div>
            <div>
              <Muted className="text-sm">Status</Muted>
              <Badge variant="default" className="mt-1">
                {order.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {trackingEvents.map((event, index) => {
              const isCurrent = index === currentEventIndex;
              const isLast = index === trackingEvents.length - 1;
              return (
                <div key={event.id} className="flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full p-2 ${getStatusColor(
                        event.completed,
                        isCurrent
                      )}`}
                    >
                      {getStatusIcon(event.status)}
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 ${
                          event.completed ? 'bg-green-200' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-8 last:pb-0">
                    <div className="flex items-start justify-between mb-1">
                      <P className="font-semibold">{event.description}</P>
                      {event.timestamp && (
                        <Muted className="text-sm">
                          {format(new Date(event.timestamp), 'MMM dd, yyyy HH:mm')}
                        </Muted>
                      )}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                    {isCurrent && !event.completed && (
                      <Badge variant="outline" className="mt-2">
                        Current Status
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <P className="font-semibold">{order.shippingAddress.fullName}</P>
            <P className="text-muted-foreground">
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </P>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {order.shippingAddress.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {order.shippingAddress.email}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimated Delivery */}
      {currentEvent && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Estimated Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-lg font-semibold mb-2">
              {format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 'EEEE, MMMM dd, yyyy')}
            </P>
            <Muted className="text-sm">
              Your order is currently {currentEvent.description.toLowerCase()}
            </Muted>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderTrackingPage;
