import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/context/CurrencyContext';
import { DollarSign, TrendingUp, Download, Calendar, CreditCard, Percent, FileText, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import VendorMetricsCard from '@/components/vendor/VendorMetricsCard';
import { Link } from 'react-router-dom';

const VendorEarningsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock earnings data
  const earnings = {
    totalEarnings: 45230.50,
    pendingPayout: 8230.50,
    availableBalance: 37000.00,
    commissionRate: 15, // percentage
    totalOrders: 156,
    averageOrderValue: 289.94,
    payouts: [
      {
        id: 'payout1',
        amount: 12000.00,
        date: '2023-10-15',
        status: 'completed',
        method: 'bank_transfer',
      },
      {
        id: 'payout2',
        amount: 15000.00,
        date: '2023-11-01',
        status: 'completed',
        method: 'bank_transfer',
      },
      {
        id: 'payout3',
        amount: 8230.50,
        date: '2023-11-15',
        status: 'pending',
        method: 'bank_transfer',
      },
    ],
    transactions: [
      {
        id: 'txn1',
        orderId: 'ord1',
        amount: 299.99,
        commission: 45.00,
        date: '2023-11-05',
        status: 'completed',
      },
      {
        id: 'txn2',
        orderId: 'ord2',
        amount: 189.50,
        commission: 28.43,
        date: '2023-11-04',
        status: 'completed',
      },
      {
        id: 'txn3',
        orderId: 'ord3',
        amount: 120.00,
        commission: 18.00,
        date: '2023-11-03',
        status: 'pending',
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Earnings & Payouts</H1>
          <P className="text-muted-foreground">Track your earnings and manage payouts</P>
        </div>
        <div className="flex gap-2">
          <Link to="/vendor/payouts">
            <Button variant="outline">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Manage Payouts
            </Button>
          </Link>
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
        </div>
      </div>

      {/* Earnings Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <VendorMetricsCard
          title="Total Earnings"
          value={formatPrice(earnings.totalEarnings)}
          icon={DollarSign}
          description={`${timeRange} period`}
          variant="success"
        />
        <VendorMetricsCard
          title="Available Balance"
          value={formatPrice(earnings.availableBalance)}
          icon={CreditCard}
          description="Ready for payout"
        />
        <VendorMetricsCard
          title="Pending Payout"
          value={formatPrice(earnings.pendingPayout)}
          icon={Calendar}
          description="Processing"
          variant="warning"
        />
        <VendorMetricsCard
          title="Commission Rate"
          value={`${earnings.commissionRate}%`}
          icon={Percent}
          description="Platform commission"
        />
      </div>

      {/* Earnings Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(earnings.totalEarnings)}</div>
            <Muted className="text-xs">All time earnings</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(earnings.availableBalance)}</div>
            <Muted className="text-xs">Ready for payout</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(earnings.pendingPayout)}</div>
            <Muted className="text-xs">Next payout: Nov 15</Muted>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="settings">Payout Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Order Amount</TableHead>
                    <TableHead>Commission ({earnings.commissionRate}%)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.transactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-medium">#{txn.orderId}</TableCell>
                      <TableCell>{formatPrice(txn.amount)}</TableCell>
                      <TableCell className="font-semibold text-accent-gold">
                        {formatPrice(txn.commission)}
                      </TableCell>
                      <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(txn.status)}>
                          {txn.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">#{payout.id}</TableCell>
                      <TableCell className="font-semibold">{formatPrice(payout.amount)}</TableCell>
                      <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                      <TableCell className="capitalize">
                        {payout.method.replace('_', ' ')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payout Schedule</Label>
                <Select defaultValue="bi-weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payout Method</Label>
                <Select defaultValue="bank_transfer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t">
                <P className="text-sm text-muted-foreground mb-2">
                  Commission Rate: {earnings.commissionRate}%
                </P>
                <P className="text-xs text-muted-foreground">
                  Your commission rate is set by the platform. Contact support to discuss changes.
                </P>
              </div>
              <Button className="w-full">Update Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorEarningsPage;

