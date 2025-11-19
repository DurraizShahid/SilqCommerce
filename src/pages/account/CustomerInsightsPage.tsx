import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/context/CurrencyContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Star, 
  Calendar,
  Download,
  Target,
  Award,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { orders } from '@/data/dummyData';
import MetricChart from '@/components/analytics/MetricChart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomerInsightsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [timeRange, setTimeRange] = useState('30d');

  const customerData = useMemo(() => {
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalSpent / totalOrders;
    const favoriteCategory = 'Dresses'; // Mock data
    const lifetimeValue = totalSpent * 1.5; // Projected CLV
    const memberSince = '2023-01-15';
    
    // Monthly spending data
    const monthlySpending = [
      { month: 'Jan', amount: 1200 },
      { month: 'Feb', amount: 1500 },
      { month: 'Mar', amount: 1800 },
      { month: 'Apr', amount: 1400 },
      { month: 'May', amount: 2100 },
      { month: 'Jun', amount: 1900 },
    ];

    // Category breakdown
    const categoryBreakdown = [
      { name: 'Dresses', value: 35, amount: 3500 },
      { name: 'Accessories', value: 25, amount: 2500 },
      { name: 'Footwear', value: 20, amount: 2000 },
      { name: 'Bags', value: 15, amount: 1500 },
      { name: 'Other', value: 5, amount: 500 },
    ];

    // Purchase frequency
    const purchaseFrequency = [
      { period: 'Week 1', orders: 2 },
      { period: 'Week 2', orders: 3 },
      { period: 'Week 3', orders: 1 },
      { period: 'Week 4', orders: 4 },
    ];

    return {
      totalSpent,
      totalOrders,
      averageOrderValue,
      favoriteCategory,
      lifetimeValue,
      memberSince,
      monthlySpending,
      categoryBreakdown,
      purchaseFrequency,
    };
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const handleExportReport = () => {
    toast.info('Generating your insights report...');
    setTimeout(() => {
      toast.success('Report generated! Check your email for download link.');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>My Insights</H1>
          <P className="text-muted-foreground">Your shopping behavior and purchase analytics</P>
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
              <SelectItem value="all">All time</SelectItem>
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
        <MetricChart
          title="Total Spent"
          value={formatPrice(customerData.totalSpent)}
          change={12.5}
          changeLabel="vs previous period"
          trend="up"
          description="All-time spending"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={customerData.monthlySpending}>
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </MetricChart>

        <MetricChart
          title="Total Orders"
          value={customerData.totalOrders}
          change={8.3}
          changeLabel="vs previous period"
          trend="up"
          description="Orders placed"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customerData.purchaseFrequency}>
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </MetricChart>

        <MetricChart
          title="Average Order Value"
          value={formatPrice(customerData.averageOrderValue)}
          change={5.2}
          changeLabel="vs previous period"
          trend="up"
          description="Per order average"
        />

        <MetricChart
          title="Lifetime Value"
          value={formatPrice(customerData.lifetimeValue)}
          description="Projected CLV"
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trends</CardTitle>
                <CardDescription>Monthly spending over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customerData.monthlySpending}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} name="Spending" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Preferences</CardTitle>
                <CardDescription>Spending by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Member Since</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <P className="font-semibold">{format(new Date(customerData.memberSince), 'MMMM yyyy')}</P>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Favorite Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <P className="font-semibold">{customerData.favoriteCategory}</P>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Shopping Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <P className="font-semibold">12 days</P>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Breakdown</CardTitle>
              <CardDescription>Detailed spending analysis by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={customerData.monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" name="Spending ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Spending</CardTitle>
              <CardDescription>Breakdown of spending by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerData.categoryBreakdown.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <P className="font-semibold">{category.name}</P>
                      </div>
                      <div className="flex items-center gap-4">
                        <P>{formatPrice(category.amount)}</P>
                        <Badge variant="outline">{category.value}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.value}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Frequency</CardTitle>
              <CardDescription>Order frequency over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerData.purchaseFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerInsightsPage;
