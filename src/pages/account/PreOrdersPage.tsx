import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { preOrders } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { Calendar, Package, X, CreditCard, TrendingUp, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const PreOrdersPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [userPreOrders, setUserPreOrders] = useState(preOrders);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'shipped'>('all');

  const handleCancel = (preOrderId: string) => {
    setUserPreOrders((prev) =>
      prev.map((order) =>
        order.id === preOrderId ? { ...order, status: 'cancelled' as const } : order
      )
    );
    toast.success('Pre-order cancelled. Deposit will be refunded within 5-7 business days.');
  };

  const getFilteredPreOrders = () => {
    switch (activeTab) {
      case 'pending':
        return userPreOrders.filter((o) => o.status === 'pending');
      case 'confirmed':
        return userPreOrders.filter((o) => o.status === 'confirmed');
      case 'shipped':
        return userPreOrders.filter((o) => o.status === 'shipped');
      default:
        return userPreOrders.filter((o) => o.status !== 'cancelled');
    }
  };

  const getDaysUntilRelease = (releaseDate: string) => {
    const days = Math.ceil((new Date(releaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getReleaseProgress = (releaseDate: string) => {
    // Assume pre-order was placed 30 days before release
    const totalDays = 30;
    const daysUntil = getDaysUntilRelease(releaseDate);
    const progress = Math.max(0, Math.min(100, ((totalDays - daysUntil) / totalDays) * 100));
    return progress;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const totalPreOrderValue = userPreOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div>
        <H1>My Pre-Orders</H1>
        <P className="text-muted-foreground">Track your pre-ordered products</P>
      </div>

      {/* Stats */}
      {userPreOrders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Pre-Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <P className="text-2xl font-bold">
                  {userPreOrders.filter((o) => o.status !== 'cancelled').length}
                </P>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <P className="text-2xl font-bold">{formatPrice(totalPreOrderValue)}</P>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Deposits Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <P className="text-2xl font-bold">
                  {formatPrice(
                    userPreOrders
                      .filter((o) => o.status !== 'cancelled')
                      .reduce((sum, order) => sum + order.depositAmount, 0)
                  )}
                </P>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {userPreOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-4">You don't have any pre-orders.</P>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All ({userPreOrders.filter((o) => o.status !== 'cancelled').length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({userPreOrders.filter((o) => o.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({userPreOrders.filter((o) => o.status === 'confirmed').length})</TabsTrigger>
            <TabsTrigger value="shipped">Shipped ({userPreOrders.filter((o) => o.status === 'shipped').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {getFilteredPreOrders().length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <P className="text-lg text-muted-foreground">No {activeTab} pre-orders</P>
                </CardContent>
              </Card>
            ) : (
              getFilteredPreOrders().map((preOrder) => {
                const daysUntil = getDaysUntilRelease(preOrder.expectedReleaseDate);
                const progress = getReleaseProgress(preOrder.expectedReleaseDate);
                return (
            <Card key={preOrder.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{preOrder.productName}</CardTitle>
                    <Muted className="mt-1">Pre-Order #{preOrder.id}</Muted>
                  </div>
                  <Badge variant={getStatusColor(preOrder.status)}>
                    {preOrder.status.charAt(0).toUpperCase() + preOrder.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Release Progress */}
                {preOrder.status !== 'shipped' && preOrder.status !== 'cancelled' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Muted className="text-sm">Release Progress</Muted>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {daysUntil > 0 ? `${daysUntil} days left` : 'Releasing soon'}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <Muted className="text-xs">
                      Expected release: {new Date(preOrder.expectedReleaseDate).toLocaleDateString()}
                    </Muted>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Muted className="text-xs">Quantity</Muted>
                    <P className="font-semibold">{preOrder.quantity}</P>
                  </div>
                  <div>
                    <Muted className="text-xs">Expected Release</Muted>
                    <P className="font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(preOrder.expectedReleaseDate).toLocaleDateString()}
                    </P>
                    {daysUntil > 0 && (
                      <Muted className="text-xs mt-1">
                        {daysUntil} day{daysUntil !== 1 ? 's' : ''} away
                      </Muted>
                    )}
                  </div>
                  <div>
                    <Muted className="text-xs">Deposit Paid</Muted>
                    <P className="font-semibold flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {formatPrice(preOrder.depositAmount)}
                    </P>
                  </div>
                  <div>
                    <Muted className="text-xs">Total Amount</Muted>
                    <P className="font-semibold">{formatPrice(preOrder.totalAmount)}</P>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <Muted>Remaining Balance</Muted>
                    <P className="font-semibold">
                      {formatPrice(preOrder.totalAmount - preOrder.depositAmount)}
                    </P>
                  </div>
                  <P className="text-sm text-muted-foreground">
                    The remaining balance will be charged when your order ships.
                  </P>
                </div>
                {preOrder.status !== 'cancelled' && preOrder.status !== 'shipped' && (
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/products/${preOrder.productId}`}>View Product</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(preOrder.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel Pre-Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PreOrdersPage;

