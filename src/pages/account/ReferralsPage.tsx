import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Share2, Gift, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';

interface Referral {
  id: string;
  email: string;
  status: 'pending' | 'signed_up' | 'purchased';
  rewardEarned: number;
  date: string;
}

const ReferralsPage: React.FC = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [referralCode, setReferralCode] = useState('LUXURY2024');
  const [referralLink, setReferralLink] = useState(
    `${window.location.origin}/signup?ref=${referralCode}`
  );

  const [referrals, setReferrals] = useState<Referral[]>([
    {
      id: 'ref1',
      email: 'friend@example.com',
      status: 'purchased',
      rewardEarned: 50,
      date: '2023-11-15',
    },
    {
      id: 'ref2',
      email: 'colleague@example.com',
      status: 'signed_up',
      rewardEarned: 10,
      date: '2023-11-10',
    },
    {
      id: 'ref3',
      email: 'family@example.com',
      status: 'pending',
      rewardEarned: 0,
      date: '2023-11-05',
    },
  ]);

  const stats = {
    totalReferrals: referrals.length,
    successfulReferrals: referrals.filter((r) => r.status === 'purchased').length,
    totalEarned: referrals.reduce((sum, r) => sum + r.rewardEarned, 0),
    pendingRewards: referrals.filter((r) => r.status === 'pending').length,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Luxury Store',
          text: 'Get exclusive access and rewards!',
          url: referralLink,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      handleCopyLink();
    }
  };

  const getStatusBadge = (status: Referral['status']) => {
    const variants: Record<Referral['status'], 'default' | 'secondary' | 'outline'> = {
      pending: 'outline',
      signed_up: 'secondary',
      purchased: 'default',
    };
    return (
      <Badge variant={variants[status]}>
        {status === 'pending' && 'Pending'}
        {status === 'signed_up' && 'Signed Up'}
        {status === 'purchased' && 'Purchased'}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Referral Program</H1>
        <P className="text-muted-foreground">
          Invite friends and earn rewards for every successful referral
        </P>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.successfulReferrals}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gift className="h-4 w-4 text-yellow-500" />
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatPrice(stats.totalEarned)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.pendingRewards}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code & Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Code</CardTitle>
          <CardDescription>
            Share your unique code with friends to earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Referral Code</Label>
            <div className="flex gap-2">
              <Input value={referralCode} readOnly className="font-mono text-lg" />
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Referral Link</Label>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="text-sm" />
              <Button onClick={handleShare} variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <P className="text-sm font-semibold mb-2">How it works:</P>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Share your referral code or link with friends</li>
              <li>They get $10 off their first purchase</li>
              <li>You earn $10 when they sign up</li>
              <li>You earn $50 when they make their first purchase</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward Earned</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <P className="text-muted-foreground">No referrals yet</P>
                  </TableCell>
                </TableRow>
              ) : (
                referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.email}</TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>
                      {referral.rewardEarned > 0 ? (
                        <span className="font-semibold text-green-600">
                          {formatPrice(referral.rewardEarned)}
                        </span>
                      ) : (
                        <Muted>-</Muted>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(referral.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralsPage;

