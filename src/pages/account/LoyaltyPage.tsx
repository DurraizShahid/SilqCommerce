import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gift, Star, TrendingUp, Award, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';

interface LoyaltyTier {
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  category: 'discount' | 'product' | 'experience' | 'cashback';
  value?: number;
}

interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired';
  amount: number;
  description: string;
  date: string;
  orderId?: string;
}

const LoyaltyPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [currentPoints, setCurrentPoints] = useState(2450);
  const [lifetimePoints, setLifetimePoints] = useState(12500);
  const [referralCode] = useState('LUXURY2024');

  const tiers: LoyaltyTier[] = [
    {
      name: 'Bronze',
      minPoints: 0,
      benefits: ['5% points on purchases', 'Birthday rewards', 'Early access to sales'],
      color: 'bg-amber-600',
    },
    {
      name: 'Silver',
      minPoints: 1000,
      benefits: ['7% points on purchases', 'Free shipping', 'Exclusive events', 'Priority support'],
      color: 'bg-gray-400',
    },
    {
      name: 'Gold',
      minPoints: 5000,
      benefits: ['10% points on purchases', 'VIP customer service', 'Personal shopper access', 'Special discounts'],
      color: 'bg-yellow-400',
    },
    {
      name: 'Platinum',
      minPoints: 10000,
      benefits: ['15% points on purchases', 'Concierge service', 'Private shopping events', 'Luxury gifts'],
      color: 'bg-purple-500',
    },
    {
      name: 'Diamond',
      minPoints: 25000,
      benefits: ['20% points on purchases', 'White-glove service', 'Exclusive collections', 'Annual luxury gift'],
      color: 'bg-blue-500',
    },
  ];

  const currentTier = tiers
    .slice()
    .reverse()
    .find((tier) => lifetimePoints >= tier.minPoints) || tiers[0];

  const nextTier = tiers.find((tier) => lifetimePoints < tier.minPoints) || tiers[tiers.length - 1];
  const pointsToNextTier = nextTier.minPoints - lifetimePoints;
  const progressToNextTier = nextTier
    ? ((lifetimePoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100;

  const rewards: Reward[] = [
    {
      id: 'r1',
      name: '$10 Off',
      description: 'Redeem for $10 discount on any purchase',
      pointsRequired: 1000,
      category: 'discount',
      value: 10,
    },
    {
      id: 'r2',
      name: '$25 Off',
      description: 'Redeem for $25 discount on any purchase',
      pointsRequired: 2500,
      category: 'discount',
      value: 25,
    },
    {
      id: 'r3',
      name: '$50 Off',
      description: 'Redeem for $50 discount on any purchase',
      pointsRequired: 5000,
      category: 'discount',
      value: 50,
    },
    {
      id: 'r4',
      name: 'Free Shipping',
      description: 'Free express shipping on your next order',
      pointsRequired: 500,
      category: 'experience',
    },
    {
      id: 'r5',
      name: 'VIP Event Access',
      description: 'Exclusive access to private shopping events',
      pointsRequired: 3000,
      category: 'experience',
    },
  ];

  const transactions: PointsTransaction[] = [
    {
      id: 't1',
      type: 'earned',
      amount: 150,
      description: 'Purchase: Luxury Handbag',
      date: '2023-11-10',
      orderId: 'ord123',
    },
    {
      id: 't2',
      type: 'redeemed',
      amount: -1000,
      description: 'Redeemed: $10 Discount',
      date: '2023-11-05',
    },
    {
      id: 't3',
      type: 'earned',
      amount: 200,
      description: 'Purchase: Designer Watch',
      date: '2023-11-01',
      orderId: 'ord122',
    },
    {
      id: 't4',
      type: 'earned',
      amount: 50,
      description: 'Referral Bonus',
      date: '2023-10-28',
    },
  ];

  const handleRedeem = (reward: Reward) => {
    if (currentPoints < reward.pointsRequired) {
      toast.error(`You need ${reward.pointsRequired} points to redeem this reward`);
      return;
    }
    setCurrentPoints((prev) => prev - reward.pointsRequired);
    toast.success(`Reward redeemed! ${reward.name} is now available.`);
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Loyalty Program</H1>
        <P className="text-muted-foreground">Earn points, unlock rewards, and enjoy exclusive benefits</P>
      </div>

      {/* Points Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Available Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currentPoints.toLocaleString()}</div>
            <Muted className="text-sm">Ready to redeem</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Lifetime Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lifetimePoints.toLocaleString()}</div>
            <Muted className="text-sm">Total points earned</Muted>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Current Tier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={`${currentTier.color} text-white text-lg px-3 py-1`}>
              {currentTier.name}
            </Badge>
            <Muted className="text-sm mt-2 block">
              {pointsToNextTier > 0
                ? `${pointsToNextTier.toLocaleString()} points to ${nextTier.name}`
                : 'Maximum tier achieved!'}
            </Muted>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      {pointsToNextTier > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress to {nextTier.name} Tier</CardTitle>
            <CardDescription>
              Earn {pointsToNextTier.toLocaleString()} more points to unlock {nextTier.name} benefits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressToNextTier} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{currentTier.name} ({currentTier.minPoints.toLocaleString()} pts)</span>
              <span>{nextTier.name} ({nextTier.minPoints.toLocaleString()} pts)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Your {currentTier.name} Tier Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentTier.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-accent-gold" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList>
          <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
          <TabsTrigger value="history">Points History</TabsTrigger>
          <TabsTrigger value="referral">Referral Program</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <Card key={reward.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{reward.name}</CardTitle>
                      <CardDescription className="mt-1">{reward.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{reward.pointsRequired} pts</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {reward.value && (
                    <P className="text-2xl font-bold text-accent-gold">
                      {formatPrice(reward.value)}
                    </P>
                  )}
                </CardContent>
                <CardContent className="pt-0">
                  <Button
                    className="w-full"
                    onClick={() => handleRedeem(reward)}
                    disabled={currentPoints < reward.pointsRequired}
                  >
                    Redeem Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Points Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === 'earned'
                              ? 'default'
                              : transaction.type === 'redeemed'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}
                        {transaction.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <CardDescription>
                Share your referral code and earn points when friends make their first purchase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your Referral Code</Label>
                <div className="flex gap-2">
                  <Input value={referralCode} readOnly className="font-mono text-lg" />
                  <Button variant="outline" onClick={handleCopyReferralCode}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <P className="font-semibold mb-2">How it works:</P>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Share your code with friends</li>
                  <li>• They get 10% off their first order</li>
                  <li>• You earn 500 points when they make a purchase</li>
                  <li>• No limit on referrals!</li>
                </ul>
              </div>
              <Button className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share Referral Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyPage;

