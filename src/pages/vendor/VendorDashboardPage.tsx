import React, { useMemo } from "react";
import { H1, H2, P, Muted } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, products } from "@/data/dummyData";
import { Link } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
import VendorMetricsCard from "@/components/vendor/VendorMetricsCard";
import OrderStatusBadge from "@/components/vendor/OrderStatusBadge";
import { DollarSign, ShoppingCart, Package, TrendingUp, Users, Star, AlertTriangle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const VendorDashboardPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  
  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    const previousRevenue = revenue * 0.88; // Simulate 12% increase
    const revenueChange = ((revenue - previousRevenue) / previousRevenue) * 100;
    
    const totalOrders = orders.length;
    const previousOrders = Math.floor(totalOrders * 0.91);
    const ordersChange = ((totalOrders - previousOrders) / previousOrders) * 100;
    
    const pendingOrders = orders.filter((order) => 
      order.status !== "Delivered" && order.status !== "Cancelled"
    ).length;
    
    const lowInventory = products.filter((product) => product.stock < 10);
    const outOfStock = products.filter((product) => product.stock === 0);
    
    const averageOrderValue = revenue / totalOrders || 0;
    const previousAOV = averageOrderValue * 0.95;
    const aovChange = ((averageOrderValue - previousAOV) / previousAOV) * 100;
    
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.stock > 0).length;
    
    const conversionRate = 3.2; // Mock conversion rate
    const previousConversion = 2.8;
    const conversionChange = ((conversionRate - previousConversion) / previousConversion) * 100;
    
    return {
      revenue,
      revenueChange,
      totalOrders,
      ordersChange,
      pendingOrders,
      lowInventory: lowInventory.length,
      outOfStock: outOfStock.length,
      averageOrderValue,
      aovChange,
      totalProducts,
      activeProducts,
      conversionRate,
      conversionChange,
      lowInventoryItems: lowInventory,
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H1 className="mb-1">Vendor Workspace</H1>
          <P className="text-muted-foreground">Monitor sales, inventory, and fulfillment at a glance.</P>
        </div>
        <div className="flex gap-3">
          <Link to="/vendor/products">
            <Button variant="outline">Manage Products</Button>
          </Link>
          <Link to="/vendor/orders">
            <Button variant="outline">Manage Orders</Button>
          </Link>
          <Link to="/vendor/analytics">
            <Button variant="outline">Analytics</Button>
          </Link>
          <Link to="/vendor/promotions">
            <Button variant="outline">Promotions</Button>
          </Link>
          <Link to="/vendor/earnings">
            <Button variant="outline">Earnings</Button>
          </Link>
          <Link to="/vendor/storefront">
            <Button variant="outline">Customize Store</Button>
          </Link>
          <Link to="/vendor/inventory">
            <Button variant="outline">Inventory</Button>
          </Link>
          <Link to="/vendor/messages">
            <Button variant="outline">Messages</Button>
          </Link>
          <Link to="/vendor/performance">
            <Button variant="outline">Performance</Button>
          </Link>
          <Link to="/vendor/templates">
            <Button variant="outline">Templates</Button>
          </Link>
          <Link to="/vendor/scheduling">
            <Button variant="outline">Scheduling</Button>
          </Link>
          <Link to="/vendor/shipping">
            <Button variant="outline">Shipping</Button>
          </Link>
          <Link to="/vendor/returns">
            <Button variant="outline">Returns</Button>
          </Link>
          <Link to="/vendor/email-campaigns">
            <Button variant="outline">Email Campaigns</Button>
          </Link>
          <Link to="/vendor/social-media">
            <Button variant="outline">Social Media</Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <VendorMetricsCard
          title="Total Revenue"
          value={formatPrice(metrics.revenue)}
          change={metrics.revenueChange}
          changeLabel="vs last period"
          icon={DollarSign}
          trend={metrics.revenueChange >= 0 ? 'up' : 'down'}
          description="Last 30 days"
        />
        <VendorMetricsCard
          title="Total Orders"
          value={metrics.totalOrders}
          change={metrics.ordersChange}
          changeLabel="vs last period"
          icon={ShoppingCart}
          trend={metrics.ordersChange >= 0 ? 'up' : 'down'}
          description={`${metrics.pendingOrders} in progress`}
        />
        <VendorMetricsCard
          title="Average Order Value"
          value={formatPrice(metrics.averageOrderValue)}
          change={metrics.aovChange}
          changeLabel="vs last period"
          icon={TrendingUp}
          trend={metrics.aovChange >= 0 ? 'up' : 'down'}
          description="Per order"
        />
        <VendorMetricsCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change={metrics.conversionChange}
          changeLabel="vs last period"
          icon={Users}
          trend={metrics.conversionChange >= 0 ? 'up' : 'down'}
          description="Visitor to customer"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Muted className="text-sm">Active Products</Muted>
                <P className="font-semibold">{metrics.activeProducts}/{metrics.totalProducts}</P>
              </div>
              <Progress value={(metrics.activeProducts / metrics.totalProducts) * 100} className="h-2" />
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-600" />
                  <Muted>{metrics.lowInventory} low stock</Muted>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                  <Muted>{metrics.outOfStock} out of stock</Muted>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingOrders}</div>
            <Muted className="text-xs mt-1">Require attention</Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <Muted className="text-xs mt-1">Based on 156 reviews</Muted>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Open orders</CardTitle>
            <Link to="/vendor/orders">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <P className="font-medium">{order.id}</P>
                      <Muted>{order.customerName}</Muted>
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>{formatPrice(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Inventory alerts</CardTitle>
            <Link to="/vendor/products">
              <Button variant="ghost" size="sm">
                Update stock
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.lowInventoryItems.length === 0 ? (
              <Muted>All items are well stocked.</Muted>
            ) : (
              metrics.lowInventoryItems.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <P className="font-medium">{product.name}</P>
                    <Muted>{product.stock} units left</Muted>
                  </div>
                  <Button variant="outline" size="sm">
                    Reorder
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboardPage;

