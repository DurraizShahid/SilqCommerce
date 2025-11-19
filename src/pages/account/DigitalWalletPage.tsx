import React, { useState, useMemo } from 'react';
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
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History, CreditCard, TrendingUp, Gift, Coins } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
}

interface WalletBalance {
  available: number;
  pending: number;
  total: number;
}

const DigitalWalletPage: React.FC = () => {
  const { formatPrice, currency } = useCurrency();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'add-funds' | 'withdraw'>('overview');
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    available: 1250.75,
    pending: 150.00,
    total: 1400.75,
  });

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: 'txn1',
      type: 'credit',
      amount: 500.00,
      description: 'Added funds via Credit Card',
      date: '2023-11-10',
      status: 'completed',
      reference: 'PAY-12345',
    },
    {
      id: 'txn2',
      type: 'debit',
      amount: 299.99,
      description: 'Purchase: Luxury Handbag',
      date: '2023-11-08',
      status: 'completed',
      reference: 'ORD-67890',
    },
    {
      id: 'txn3',
      type: 'credit',
      amount: 50.00,
      description: 'Refund: Designer Watch',
      date: '2023-11-05',
      status: 'completed',
      reference: 'REF-11111',
    },
    {
      id: 'txn4',
      type: 'credit',
      amount: 100.00,
      description: 'Loyalty Points Redeemed',
      date: '2023-11-03',
      status: 'completed',
      reference: 'LOY-22222',
    },
    {
      id: 'txn5',
      type: 'credit',
      amount: 200.00,
      description: 'Gift Card Redeemed',
      date: '2023-11-01',
      status: 'completed',
      reference: 'GFT-33333',
    },
  ]);

  const handleAddFunds = () => {
    const amount = parseFloat(addFundsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    // Simulate adding funds
    setWalletBalance((prev) => ({
      ...prev,
      available: prev.available + amount,
      total: prev.total + amount,
    }));

    setTransactions((prev) => [
      {
        id: `txn-${Date.now()}`,
        type: 'credit',
        amount,
        description: `Added funds via ${selectedPaymentMethod}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
      ...prev,
    ]);

    toast.success(`Successfully added ${formatPrice(amount)} to your wallet`);
    setIsAddFundsOpen(false);
    setAddFundsAmount('');
    setSelectedPaymentMethod('');
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > walletBalance.available) {
      toast.error('Insufficient balance');
      return;
    }

    // Simulate withdrawal
    setWalletBalance((prev) => ({
      ...prev,
      available: prev.available - amount,
      pending: prev.pending + amount,
    }));

    setTransactions((prev) => [
      {
        id: `txn-${Date.now()}`,
        type: 'debit',
        amount,
        description: 'Withdrawal to bank account',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        reference: `WTH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
      ...prev,
    ]);

    toast.success(`Withdrawal request submitted. ${formatPrice(amount)} will be processed within 2-3 business days.`);
    setIsWithdrawOpen(false);
    setWithdrawAmount('');
  };

  const filteredTransactions = useMemo(() => {
    return transactions;
  }, [transactions]);

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? (
      <ArrowDownLeft className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-600" />
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Digital Wallet</H1>
          <P className="text-muted-foreground">Manage your wallet balance and transactions</P>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddFundsOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
          <Button variant="outline" onClick={() => setIsWithdrawOpen(true)}>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatPrice(walletBalance.available)}</div>
            <Muted className="text-xs mt-1">Ready to use</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatPrice(walletBalance.pending)}</div>
            <Muted className="text-xs mt-1">Processing</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatPrice(walletBalance.total)}</div>
            <Muted className="text-xs mt-1">All funds</Muted>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsAddFundsOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds to Wallet
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsWithdrawOpen(true)}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Withdraw to Bank
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/account/payment-methods">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Payment Methods
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <P className="font-medium text-sm">{transaction.description}</P>
                          <Muted className="text-xs">{new Date(transaction.date).toLocaleDateString()}</Muted>
                        </div>
                      </div>
                      <div className="text-right">
                        <P className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatPrice(transaction.amount)}
                        </P>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4" onClick={() => setActiveTab('transactions')}>
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'credit' ? 'default' : 'secondary'}>
                          {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatPrice(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{transaction.reference}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-funds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Funds to Wallet</CardTitle>
              <CardDescription>Add money to your wallet for faster checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="Enter amount"
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddFunds} className="w-full" disabled={!addFundsAmount || !selectedPaymentMethod}>
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Transfer money from your wallet to your bank account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <Muted className="text-sm">Available Balance</Muted>
                <P className="text-2xl font-bold">{formatPrice(walletBalance.available)}</P>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawAmount">Withdrawal Amount</Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  step="0.01"
                  min="1"
                  max={walletBalance.available}
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Muted className="text-xs">Minimum withdrawal: {formatPrice(10)}</Muted>
              </div>
              <Button onClick={handleWithdraw} className="w-full" disabled={!withdrawAmount || parseFloat(withdrawAmount) > walletBalance.available}>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Request Withdrawal
              </Button>
              <Muted className="text-xs block">
                Withdrawals typically process within 2-3 business days
              </Muted>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Funds Dialog */}
      <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds to Wallet</DialogTitle>
            <DialogDescription>Add money to your wallet for faster checkout</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dialogAmount">Amount</Label>
              <Input
                id="dialogAmount"
                type="number"
                step="0.01"
                min="1"
                placeholder="Enter amount"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialogPaymentMethod">Payment Method</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFundsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFunds} disabled={!addFundsAmount || !selectedPaymentMethod}>
              Add Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>Transfer money to your bank account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <Muted className="text-sm">Available Balance</Muted>
              <P className="text-2xl font-bold">{formatPrice(walletBalance.available)}</P>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialogWithdrawAmount">Withdrawal Amount</Label>
              <Input
                id="dialogWithdrawAmount"
                type="number"
                step="0.01"
                min="1"
                max={walletBalance.available}
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} disabled={!withdrawAmount || parseFloat(withdrawAmount) > walletBalance.available}>
              Request Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DigitalWalletPage;

