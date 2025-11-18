import React from 'react';
import { H1, P, H2 } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { orders, products } from '@/data/dummyData';
import { Package, ListOrdered, Users } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'Pending').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-8">
      <H1 className="mb-4">Dashboard</H1>
      <P className="text-lg text-muted-foreground">
        Welcome to the Modern Luxe Admin Panel. Here's a quick overview of your store.
      </P>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <P className="text-xs text-muted-foreground [&:not(:first-child)]:mt-1">
              Items in your catalog
            </P>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <P className="text-xs text-muted-foreground [&:not(:first-child)]:mt-1">
              All time orders
            </P>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ListOrdered className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <P className="text-xs text-muted-foreground [&:not(:first-child)]:mt-1">
              Awaiting processing
            </P>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" /> {/* Using Users as a placeholder for now */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <P className="text-xs text-muted-foreground [&:not(:first-child)]:mt-1">
              Generated from sales
            </P>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <H2>Recent Orders</H2>
        {/* Placeholder for a table of recent orders */}
        <Card>
          <CardContent className="p-4">
            <P className="text-muted-foreground">
              Detailed recent orders will appear here.
            </P>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <H2>Product Stock Levels</H2>
        {/* Placeholder for a table of product stock levels */}
        <Card>
          <CardContent className="p-4">
            <P className="text-muted-foreground">
              Product stock information will appear here.
            </P>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdminDashboard;