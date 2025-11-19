import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, TrendingUp, Download, Calendar, CreditCard, ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import VendorMetricsCard from '@/components/vendor/VendorMetricsCard';

interface Payout {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank_transfer' | 'paypal' | 'stripe';
  reference?: string;
  scheduledDate?: string;
}

const VendorPayoutsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'payouts' | 'request'>('overview');
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestAmount, setRequestAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');

  const [availableBalance, setAvailableBalance] = useState(8230.50);
  const [pendingPayout, setPendingPayout] = useState(1500.00);
  const [totalEarnings, setTotalEarnings] = useState(45230.50);

  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: 'payout1',
      amount: 12000.00,
      date: '2023-10-15',
      status: 'completed',
      method: 'bank_transfer',
      reference: 'PAY-12345',
    },
    {
      id: 'payout2',
      amount: 15000.00,
      date: '2023-11-01',
      status: 'completed',
      method: 'bank_transfer',
      reference: 'PAY-67890',
    },
    {
      id: 'payout3',
      amount: 8230.50,
      date: '2023-11-15',
      status: 'processing',
      method: 'bank_transfer',
      reference: 'PAY-11111',
      scheduledDate: '2023-11-18',
    },
    {
      id: 'payout4',
      amount: 1500.00,
      date: '2023-11-20',
      status: 'pending',
      method: 'bank_transfer',
      scheduledDate: '2023-11-25',
    },
  ]);

  const handleRequestPayout = () => {
    const amount = parseFloat(requestAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (amount < 50) {
      toast.error('Minimum payout amount is $50');
      return;
    }

    const newPayout: Payout = {
      id: `payout-${Date.now()}`,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      method: selectedMethod as any,
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setPayouts((prev) => [newPayout, ...prev]);
    setAvailableBalance((prev) => prev - amount);
    setPendingPayout((prev) => prev + amount);

    toast.success(`Payout request submitted. ${formatPrice(amount)} will be processed within 5-7 business days.`);
    setIsRequestOpen(false);
    setRequestAmount('');
    setSelectedMethod('bank_transfer');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1 w-fit"><CheckCircle className="h-3 w-3" />Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="flex items-center gap-1 w-fit"><Clock className="h-3 w-3" />Processing</Badge>;
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1 w-fit"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center gap-1 w-fit"><XCircle className="h-3 w-3" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      case 'stripe':
        return 'Stripe';
      default:
        return method;
    }
  };

  const completedPayouts = payouts.filter((p) => p.status === 'completed');
  const pendingPayouts = payouts.filter((p) => p.status === 'pending' || p.status === 'processing');
  const totalPayouts = completedPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Payouts</H1>
          <P className="text-muted-foreground">Manage your earnings and request payouts</P>
        </div>
        <Button onClick={() => setIsRequestOpen(true)}>
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Request Payout
        </Button>
      </div>

      {/* Balance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VendorMetricsCard
          title="Available Balance"
          value={formatPrice(availableBalance)}
          icon={DollarSign}
          description="Ready for payout"
          variant="success"
        />
        <VendorMetricsCard
          title="Pending Payout"
          value={formatPrice(pendingPayout)}
          icon={Clock}
          description="Processing"
          variant="warning"
        />
        <VendorMetricsCard
          title="Total Paid Out"
          value={formatPrice(totalPayouts)}
          icon={TrendingUp}
          description="All-time payouts"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payouts">All Payouts</TabsTrigger>
          <TabsTrigger value="request">Request Payout</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payouts.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <P className="font-semibold">{formatPrice(payout.amount)}</P>
                        <Muted className="text-xs">
                          {new Date(payout.date).toLocaleDateString()} • {getMethodLabel(payout.method)}
                        </Muted>
                        {payout.scheduledDate && (
                          <Muted className="text-xs block">
                            Scheduled: {new Date(payout.scheduledDate).toLocaleDateString()}
                          </Muted>
                        )}
                      </div>
                      {getStatusBadge(payout.status)}
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4" onClick={() => setActiveTab('payouts')}>
                  View All Payouts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <Muted className="text-sm">Payout Schedule</Muted>
                  <P className="font-semibold">Weekly (Every Friday)</P>
                </div>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <Muted className="text-sm">Minimum Payout</Muted>
                  <P className="font-semibold">{formatPrice(50)}</P>
                </div>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <Muted className="text-sm">Processing Time</Muted>
                  <P className="font-semibold">5-7 Business Days</P>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <P className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Commission Rate</P>
                      <Muted className="text-xs text-yellow-700 dark:text-yellow-300">
                        Your commission rate is 15%. Platform fees are deducted before payout.
                      </Muted>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>All your payout requests and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{new Date(payout.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-semibold">{formatPrice(payout.amount)}</TableCell>
                      <TableCell>{getMethodLabel(payout.method)}</TableCell>
                      <TableCell>{getStatusBadge(payout.status)}</TableCell>
                      <TableCell>
                        {payout.scheduledDate ? (
                          new Date(payout.scheduledDate).toLocaleDateString()
                        ) : (
                          <Muted className="text-xs">N/A</Muted>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{payout.reference || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="request" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
              <CardDescription>Withdraw your available earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <Muted className="text-sm">Available Balance</Muted>
                <P className="text-3xl font-bold">{formatPrice(availableBalance)}</P>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payoutAmount">Payout Amount</Label>
                <Input
                  id="payoutAmount"
                  type="number"
                  step="0.01"
                  min="50"
                  max={availableBalance}
                  placeholder="Enter amount"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                />
                <Muted className="text-xs">Minimum: {formatPrice(50)}</Muted>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payoutMethod">Payout Method</Label>
                <Select value={selectedMethod} onValueChange={setSelectedMethod}>
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
              <Button onClick={handleRequestPayout} className="w-full" disabled={!requestAmount || parseFloat(requestAmount) > availableBalance || parseFloat(requestAmount) < 50}>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Muted className="text-xs">
                  Payouts are processed weekly on Fridays. Requests submitted before Friday will be processed the following week.
                </Muted>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Payout Dialog */}
      <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>Withdraw your available earnings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <Muted className="text-sm">Available Balance</Muted>
              <P className="text-2xl font-bold">{formatPrice(availableBalance)}</P>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialogPayoutAmount">Payout Amount</Label>
              <Input
                id="dialogPayoutAmount"
                type="number"
                step="0.01"
                min="50"
                max={availableBalance}
                placeholder="Enter amount"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
              />
              <Muted className="text-xs">Minimum: {formatPrice(50)}</Muted>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialogPayoutMethod">Payout Method</Label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestPayout} disabled={!requestAmount || parseFloat(requestAmount) > availableBalance || parseFloat(requestAmount) < 50}>
              Request Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorPayoutsPage;

