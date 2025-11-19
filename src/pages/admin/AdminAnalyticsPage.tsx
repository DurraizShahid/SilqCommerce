import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/CurrencyContext';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, Store, Activity, Download, BarChart3 } from 'lucide-react';
import { orders, products, vendors } from '@/data/dummyData';
import AdminMetricsCard from '@/components/admin/AdminMetricsCard';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';

const AdminAnalyticsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock platform analytics
  const platformAnalytics = useMemo(() => {
    const revenueData = [
      { month: 'Jan', revenue: 180000, orders: 850 },
      { month: 'Feb', revenue: 195000, orders: 920 },
      { month: 'Mar', revenue: 210000, orders: 980 },
      { month: 'Apr', revenue: 225000, orders: 1050 },
      { month: 'May', revenue: 240000, orders: 1120 },
      { month: 'Jun', revenue: 245680, orders: 1245 },
    ];

    return {
      totalRevenue: 245680.50,
      totalOrders: 1245,
      totalCustomers: 892,
      totalVendors: vendors.length,
      totalProducts: products.length,
      averageOrderValue: orders.reduce((sum, o) => sum + o.total, 0) / orders.length,
      revenueData,
      topVendors: vendors.map((v) => ({
        ...v,
        revenue: Math.floor(Math.random() * 50000) + 20000,
        orders: Math.floor(Math.random() * 200) + 50,
      })),
      salesByCategory: [
        { category: 'Dresses', sales: 245, revenue: 73500 },
        { category: 'Outerwear', sales: 189, revenue: 56700 },
        { category: 'Accessories', sales: 312, revenue: 46800 },
        { category: 'Footwear', sales: 156, revenue: 46800 },
        { category: 'Bags', sales: 198, revenue: 23760 },
      ],
    };
  }, [vendors, orders]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const handleExportReport = () => {
    toast.info('Generating analytics report...');
    setTimeout(() => {
      toast.success('Report generated! Check your email for download link.');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Platform Analytics</H1>
          <P className="text-muted-foreground">Comprehensive insights across the entire marketplace</P>
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
        <AdminMetricsCard
          title="Total Revenue"
          value={formatPrice(platformAnalytics.totalRevenue)}
          change={15.3}
          changeLabel="vs previous period"
          icon={DollarSign}
          trend="up"
          description={`${timeRange} period`}
        />
        <AdminMetricsCard
          title="Total Orders"
          value={platformAnalytics.totalOrders}
          change={8.7}
          changeLabel="vs previous period"
          icon={ShoppingCart}
          trend="up"
          description="All orders"
        />
        <AdminMetricsCard
          title="Active Customers"
          value={platformAnalytics.totalCustomers}
          change={12.1}
          changeLabel="vs previous period"
          icon={Users}
          trend="up"
          description="Registered users"
        />
        <AdminMetricsCard
          title="Active Vendors"
          value={platformAnalytics.totalVendors}
          icon={Store}
          description={`${platformAnalytics.totalProducts} total products`}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vendors">Top Vendors</TabsTrigger>
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
                  <AreaChart data={platformAnalytics.revenueData}>
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
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <P className="text-sm font-medium">Average Order Value</P>
                    <Muted className="text-xs">Per transaction</Muted>
                  </div>
                  <P className="text-lg font-bold">
                    {formatPrice(platformAnalytics.averageOrderValue)}
                  </P>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <P className="text-sm font-medium">Conversion Rate</P>
                    <Muted className="text-xs">Visits to orders</Muted>
                  </div>
                  <P className="text-lg font-bold">3.2%</P>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <P className="text-sm font-medium">Customer Retention</P>
                    <Muted className="text-xs">Returning customers</Muted>
                  </div>
                  <P className="text-lg font-bold">68%</P>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platformAnalytics.topVendors
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.name}</TableCell>
                        <TableCell>
                          {vendor.isVerified ? (
                            <Badge variant="default">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatPrice(vendor.revenue)}</TableCell>
                        <TableCell>{vendor.orders}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{vendor.rating}</span>
                            <Activity className="h-3 w-3 text-yellow-500" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
                      data={platformAnalytics.salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {platformAnalytics.salesByCategory.map((entry, index) => (
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
                  {platformAnalytics.salesByCategory.map((cat, index) => {
                    const totalRevenue = platformAnalytics.salesByCategory.reduce(
                      (sum, c) => sum + c.revenue,
                      0
                    );
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

export default AdminAnalyticsPage;

