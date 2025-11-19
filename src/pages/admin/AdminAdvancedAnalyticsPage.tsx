import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Filter, TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, BarChart3 } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { Progress } from '@/components/ui/progress';

const AdminAdvancedAnalyticsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [timeRange, setTimeRange] = useState('30d');
  const [metricType, setMetricType] = useState('revenue');

  const metrics = {
    revenue: {
      current: 1250000,
      previous: 1100000,
      growth: 13.6,
      target: 1500000,
    },
    orders: {
      current: 4523,
      previous: 4100,
      growth: 10.3,
      target: 5000,
    },
    customers: {
      current: 12500,
      previous: 11200,
      growth: 11.6,
      target: 15000,
    },
    conversion: {
      current: 3.2,
      previous: 2.9,
      growth: 10.3,
      target: 4.0,
    },
  };

  const funnelData = [
    { stage: 'Visitors', count: 100000, percentage: 100 },
    { stage: 'Product Views', count: 45000, percentage: 45 },
    { stage: 'Add to Cart', count: 8500, percentage: 8.5 },
    { stage: 'Checkout Started', count: 3200, percentage: 3.2 },
    { stage: 'Orders Completed', count: 2500, percentage: 2.5 },
  ];

  const topProducts = [
    { name: 'Luxury Designer Handbag', sales: 125000, orders: 245, growth: 15.2 },
    { name: 'Premium Leather Wallet', sales: 98000, orders: 198, growth: 12.5 },
    { name: 'Designer Sunglasses', sales: 85000, orders: 156, growth: 8.3 },
    { name: 'Luxury Watch', sales: 72000, orders: 98, growth: 22.1 },
  ];

  const customerSegments = [
    { segment: 'VIP Customers', count: 250, revenue: 450000, percentage: 36 },
    { segment: 'Regular Customers', count: 3200, revenue: 580000, percentage: 46.4 },
    { segment: 'New Customers', count: 9050, revenue: 220000, percentage: 17.6 },
  ];

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (growth < 0) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Advanced Analytics</H1>
          <P className="text-muted-foreground">Deep insights into platform performance</P>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(metrics.revenue.current)}</div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(metrics.revenue.growth)}
              <span className="text-sm text-green-600">
                +{metrics.revenue.growth}%
              </span>
            </div>
            <Progress
              value={(metrics.revenue.current / metrics.revenue.target) * 100}
              className="h-2 mt-2"
            />
            <Muted className="text-xs mt-1">
              {((metrics.revenue.current / metrics.revenue.target) * 100).toFixed(0)}% of target
            </Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.orders.current.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(metrics.orders.growth)}
              <span className="text-sm text-green-600">
                +{metrics.orders.growth}%
              </span>
            </div>
            <Progress
              value={(metrics.orders.current / metrics.orders.target) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.customers.current.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(metrics.customers.growth)}
              <span className="text-sm text-green-600">
                +{metrics.customers.growth}%
              </span>
            </div>
            <Progress
              value={(metrics.customers.current / metrics.customers.target) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversion.current}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getGrowthIcon(metrics.conversion.growth)}
              <span className="text-sm text-green-600">
                +{metrics.conversion.growth}%
              </span>
            </div>
            <Progress
              value={(metrics.conversion.current / metrics.conversion.target) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="funnel" className="w-full">
        <TabsList>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Track user journey from visit to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <P className="font-semibold">{stage.stage}</P>
                      </div>
                      <div className="text-right">
                        <P className="font-semibold">{stage.count.toLocaleString()}</P>
                        <Muted className="text-xs">{stage.percentage}%</Muted>
                      </div>
                    </div>
                    <Progress value={stage.percentage} className="h-3" />
                    {index < funnelData.length - 1 && (
                      <div className="text-center text-muted-foreground text-sm">
                        ↓ {((stage.count / funnelData[index + 1].count) * 100).toFixed(1)}% drop-off
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <P className="font-semibold">{product.name}</P>
                        <Muted className="text-sm">{product.orders} orders</Muted>
                      </div>
                    </div>
                    <div className="text-right">
                      <P className="font-semibold">{formatPrice(product.sales)}</P>
                      <div className="flex items-center gap-1">
                        {getGrowthIcon(product.growth)}
                        <span className="text-sm text-green-600">+{product.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Revenue breakdown by customer segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerSegments.map((segment) => (
                  <div key={segment.segment} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <P className="font-semibold">{segment.segment}</P>
                      <div className="text-right">
                        <P className="font-semibold">{formatPrice(segment.revenue)}</P>
                        <Muted className="text-xs">{segment.count} customers</Muted>
                      </div>
                    </div>
                    <Progress value={segment.percentage} className="h-3" />
                    <Muted className="text-xs">{segment.percentage}% of total revenue</Muted>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAdvancedAnalyticsPage;

