import React, { useMemo } from 'react';
import { H1, P, H2, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orders, products } from '@/data/dummyData';
import { Package, ListOrdered, DollarSign, Users, Store, TrendingUp, AlertTriangle, CheckCircle, Clock, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminMetricsCard from '@/components/admin/AdminMetricsCard';
import { useCurrency } from '@/context/CurrencyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const AdminDashboard: React.FC = () => {
  const { formatPrice } = useCurrency();
  
  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const processingOrders = orders.filter(order => order.status === 'Processing').length;
    const shippedOrders = orders.filter(order => order.status === 'Shipped').length;
    const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const previousRevenue = totalRevenue * 0.88; // Simulate 12% increase
    const revenueChange = ((totalRevenue - previousRevenue) / previousRevenue) * 100;
    
    const activeVendors = 12; // Mock data
    const pendingVendors = 3; // Mock data
    const totalUsers = 1250; // Mock data
    const newUsers = 45; // Mock data
    
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const previousAOV = averageOrderValue * 0.95;
    const aovChange = ((averageOrderValue - previousAOV) / previousAOV) * 100;
    
    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue,
      revenueChange,
      activeVendors,
      pendingVendors,
      totalUsers,
      newUsers,
      lowStockProducts,
      outOfStockProducts,
      averageOrderValue,
      aovChange,
    };
  }, []);

  const stockData = products.map(product => ({
    name: product.name,
    stock: product.stock,
  }));

  const recentOrders = orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <H1 className="mb-4">Dashboard</H1>
      <P className="text-lg text-muted-foreground">
        Welcome to the Modern Luxe Admin Panel. Here's a quick overview of your store.
      </P>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricsCard
          title="Total Revenue"
          value={formatPrice(metrics.totalRevenue)}
          change={metrics.revenueChange}
          changeLabel="vs last period"
          icon={DollarSign}
          trend={metrics.revenueChange >= 0 ? 'up' : 'down'}
          description="All-time revenue"
        />
        <AdminMetricsCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={ShoppingCart}
          description={`${metrics.pendingOrders} pending, ${metrics.processingOrders} processing`}
        />
        <AdminMetricsCard
          title="Total Products"
          value={metrics.totalProducts}
          icon={Package}
          description={`${metrics.lowStockProducts} low stock, ${metrics.outOfStockProducts} out of stock`}
          variant={metrics.outOfStockProducts > 0 ? 'warning' : 'default'}
        />
        <AdminMetricsCard
          title="Active Vendors"
          value={metrics.activeVendors}
          icon={Store}
          description={`${metrics.pendingVendors} pending approval`}
          variant={metrics.pendingVendors > 0 ? 'warning' : 'default'}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminMetricsCard
          title="Total Users"
          value={metrics.totalUsers}
          icon={Users}
          description={`${metrics.newUsers} new this month`}
        />
        <AdminMetricsCard
          title="Average Order Value"
          value={formatPrice(metrics.averageOrderValue)}
          change={metrics.aovChange}
          changeLabel="vs last period"
          icon={TrendingUp}
          trend={metrics.aovChange >= 0 ? 'up' : 'down'}
          description="Per order"
        />
        <AdminMetricsCard
          title="Order Status"
          value={`${metrics.deliveredOrders} delivered`}
          icon={CheckCircle}
          description={`${metrics.shippedOrders} shipped, ${metrics.processingOrders} processing`}
          variant="success"
        />
        <AdminMetricsCard
          title="Inventory Alerts"
          value={metrics.lowStockProducts + metrics.outOfStockProducts}
          icon={AlertTriangle}
          description={`${metrics.outOfStockProducts} out of stock`}
          variant={metrics.outOfStockProducts > 0 ? 'danger' : 'default'}
        />
      </div>

      {/* Charts and Data Visualization */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { day: '1', revenue: 1200 },
                    { day: '5', revenue: 1900 },
                    { day: '10', revenue: 3000 },
                    { day: '15', revenue: 2800 },
                    { day: '20', revenue: 3500 },
                    { day: '25', revenue: 4200 },
                    { day: '30', revenue: 4500 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent-gold))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Delivered', value: metrics.deliveredOrders, color: '#10b981' },
                        { name: 'Shipped', value: metrics.shippedOrders, color: '#3b82f6' },
                        { name: 'Processing', value: metrics.processingOrders, color: '#f59e0b' },
                        { name: 'Pending', value: metrics.pendingOrders, color: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Delivered', value: metrics.deliveredOrders, color: '#10b981' },
                        { name: 'Shipped', value: metrics.shippedOrders, color: '#3b82f6' },
                        { name: 'Processing', value: metrics.processingOrders, color: '#f59e0b' },
                        { name: 'Pending', value: metrics.pendingOrders, color: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link to="/admin/orders">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        <Link to={`/admin/orders/${order.id}`} className="hover:underline">
                          #{order.id}
                        </Link>
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === 'Delivered' ? 'default' :
                            order.status === 'Processing' ? 'secondary' :
                            order.status === 'Pending' ? 'outline' :
                            'destructive'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-semibold">{formatPrice(order.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Stock Levels</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stockData.slice(0, 10)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} style={{ fontSize: '12px' }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stock" fill="hsl(var(--accent-gold))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Muted className="text-sm">In Stock</Muted>
                    <P className="font-semibold">{metrics.totalProducts - metrics.lowStockProducts - metrics.outOfStockProducts}</P>
                  </div>
                  <Progress value={((metrics.totalProducts - metrics.lowStockProducts - metrics.outOfStockProducts) / metrics.totalProducts) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Muted className="text-sm">Low Stock</Muted>
                    <P className="font-semibold text-yellow-600">{metrics.lowStockProducts}</P>
                  </div>
                  <Progress value={(metrics.lowStockProducts / metrics.totalProducts) * 100} className="bg-yellow-200" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Muted className="text-sm">Out of Stock</Muted>
                    <P className="font-semibold text-red-600">{metrics.outOfStockProducts}</P>
                  </div>
                  <Progress value={(metrics.outOfStockProducts / metrics.totalProducts) * 100} className="bg-red-200" />
                </div>
                <div className="pt-4 border-t">
                  <Link to="/admin/products">
                    <Button variant="outline" className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      Manage Products
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <P className="font-semibold">Active Vendors</P>
                      <Muted className="text-sm">{metrics.activeVendors} vendors</Muted>
                    </div>
                  </div>
                  <Badge variant="default">{metrics.activeVendors}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <P className="font-semibold">Pending Approval</P>
                      <Muted className="text-sm">{metrics.pendingVendors} vendors</Muted>
                    </div>
                  </div>
                  <Badge variant="outline">{metrics.pendingVendors}</Badge>
                </div>
                <div className="pt-4 border-t">
                  <Link to="/admin/vendors">
                    <Button variant="outline" className="w-full">
                      <Store className="h-4 w-4 mr-2" />
                      Manage Vendors
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link to="/admin/product-approval">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Review Product Approvals
                  </Button>
                </Link>
                <Link to="/admin/vendors">
                  <Button variant="outline" className="w-full justify-start">
                    <Store className="h-4 w-4 mr-2" />
                    Review Vendor Applications
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;