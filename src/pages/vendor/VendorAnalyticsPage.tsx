import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/CurrencyContext';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Eye, Users, Package, Star, Download } from 'lucide-react';
import { orders, products } from '@/data/dummyData';
import VendorMetricsCard from '@/components/vendor/VendorMetricsCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';

const VendorAnalyticsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analytics = useMemo(() => {
    const revenueData = [
      { month: 'Jan', revenue: 35000, orders: 120 },
      { month: 'Feb', revenue: 38000, orders: 135 },
      { month: 'Mar', revenue: 42000, orders: 145 },
      { month: 'Apr', revenue: 41000, orders: 140 },
      { month: 'May', revenue: 44000, orders: 150 },
      { month: 'Jun', revenue: 45230, orders: 156 },
    ];

    return {
      revenue: {
        current: 45230.50,
        previous: 40320.00,
        change: 12.2,
      },
      orders: {
        current: 156,
        previous: 142,
        change: 9.9,
      },
      products: {
        current: 89,
        views: 12500,
        conversion: 3.2,
      },
      customers: {
        new: 45,
        returning: 111,
        total: 156,
      },
      revenueData,
      topProducts: products.slice(0, 5).map((p) => ({
        ...p,
        sales: Math.floor(Math.random() * 50) + 10,
        revenue: (Math.floor(Math.random() * 50) + 10) * p.price,
        views: p.views || Math.floor(Math.random() * 1000) + 500,
      })),
      salesByCategory: [
        { category: 'Dresses', sales: 45, revenue: 13500 },
        { category: 'Outerwear', sales: 32, revenue: 9600 },
        { category: 'Accessories', sales: 28, revenue: 4200 },
        { category: 'Footwear', sales: 22, revenue: 6600 },
        { category: 'Bags', sales: 29, revenue: 3480 },
      ],
    };
  }, [products]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const handleExportReport = () => {
    toast.info('Generating analytics report...');
    setTimeout(() => {
      toast.success('Report generated! Check your email for download link.');
    }, 2000);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4" />
    ) : (
      <TrendingDown className="h-4 w-4" />
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Analytics Dashboard</H1>
          <P className="text-muted-foreground">Track your sales performance and customer insights</P>
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
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <VendorMetricsCard
          title="Total Revenue"
          value={formatPrice(analytics.revenue.current)}
          change={analytics.revenue.change}
          changeLabel="vs previous period"
          icon={DollarSign}
          trend={analytics.revenue.change >= 0 ? 'up' : 'down'}
          description={`${timeRange} period`}
        />
        <VendorMetricsCard
          title="Total Orders"
          value={analytics.orders.current}
          change={analytics.orders.change}
          changeLabel="vs previous period"
          icon={ShoppingCart}
          trend={analytics.orders.change >= 0 ? 'up' : 'down'}
          description="Orders placed"
        />
        <VendorMetricsCard
          title="Product Views"
          value={analytics.products.views.toLocaleString()}
          icon={Eye}
          description={`${analytics.products.conversion}% conversion rate`}
        />
        <VendorMetricsCard
          title="Customers"
          value={analytics.customers.total}
          icon={Users}
          description={`${analytics.customers.new} new, ${analytics.customers.returning} returning`}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and orders over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Revenue ($)" />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Orders" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status) => {
                    const count = orders.filter((o) => o.status === status).length;
                    const percentage = (count / orders.length) * 100;
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{status}</span>
                          <span className="font-semibold">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.topProducts.map((product) => {
                    const conversion = (product.sales / product.views) * 100;
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.views.toLocaleString()}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>{formatPrice(product.revenue)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{conversion.toFixed(2)}%</span>
                            {conversion > 3 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {analytics.salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Sales and revenue by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.salesByCategory.map((cat, index) => {
                    const totalRevenue = analytics.salesByCategory.reduce((sum, c) => sum + c.revenue, 0);
                    const percentage = (cat.revenue / totalRevenue) * 100;
                    return (
                      <div key={cat.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium">{cat.category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{cat.sales} sales</div>
                            <Muted className="text-xs">{formatPrice(cat.revenue)}</Muted>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorAnalyticsPage;

