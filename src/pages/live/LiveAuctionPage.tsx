import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Gavel,
  Clock,
  Users,
  Radio,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Timer,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import { useCurrency } from '@/context/CurrencyContext';

interface Bid {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
}

interface AuctionItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  startingBid: number;
  currentBid: number;
  bidIncrement: number;
  endTime: string;
  status: 'upcoming' | 'active' | 'ending' | 'ended';
  bidCount: number;
  bids: Bid[];
}

const LiveAuctionPage: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { formatPrice } = useCurrency();
  const [bidAmount, setBidAmount] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [viewerCount, setViewerCount] = useState(450);

  // Mock auction data
  const auction: AuctionItem = {
    id: auctionId || 'auction1',
    productId: 'prod1',
    productName: 'Luxury Designer Handbag',
    productImage: '/api/placeholder/400/400',
    startingBid: 500,
    currentBid: 1250,
    bidIncrement: 50,
    endTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    status: 'active',
    bidCount: 12,
    bids: [
      {
        id: 'b1',
        userId: 'u1',
        userName: 'Sarah M.',
        amount: 1250,
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        isWinning: true,
      },
      {
        id: 'b2',
        userId: 'u2',
        userName: 'John D.',
        amount: 1200,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isWinning: false,
      },
      {
        id: 'b3',
        userId: 'u3',
        userName: 'Lisa K.',
        amount: 1150,
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        isWinning: false,
      },
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, new Date(auction.endTime).getTime() - Date.now());
      setTimeRemaining(remaining);
      
      if (remaining === 0 && auction.status === 'active') {
        toast.success('Auction ended!');
      }
    }, 1000);

    // Simulate viewer count
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(viewerInterval);
    };
  }, [auction.endTime, auction.status]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = () => {
    const bid = parseFloat(bidAmount);
    if (isNaN(bid) || bid <= auction.currentBid) {
      toast.error(`Bid must be higher than ${formatPrice(auction.currentBid)}`);
      return;
    }

    const minBid = auction.currentBid + auction.bidIncrement;
    if (bid < minBid) {
      toast.error(`Minimum bid is ${formatPrice(minBid)}`);
      return;
    }

    toast.success(`Bid placed: ${formatPrice(bid)}`);
    setBidAmount('');
    // In real app, this would update the auction state
  };

  const handleQuickBid = () => {
    const quickBid = auction.currentBid + auction.bidIncrement;
    setBidAmount(quickBid.toString());
    handlePlaceBid();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H1 className="flex items-center gap-2">
            <Gavel className="h-8 w-8 text-primary" />
            Live Auction
          </H1>
          <P className="text-muted-foreground">{auction.productName}</P>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-red-500 animate-pulse">
            <Radio className="h-3 w-3 mr-1" />
            LIVE
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {viewerCount} watching
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Auction Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Product Image */}
          <Card>
            <div className="relative aspect-square bg-muted rounded-t-lg overflow-hidden">
              <img
                src={auction.productImage}
                alt={auction.productName}
                className="w-full h-full object-cover"
              />
              {auction.status === 'active' && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 animate-pulse">
                    <Timer className="h-3 w-3 mr-1" />
                    {formatTime(timeRemaining)}
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle>{auction.productName}</CardTitle>
              <CardDescription>
                Starting bid: {formatPrice(auction.startingBid)}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Bidding Section */}
          <Card>
            <CardHeader>
              <CardTitle>Place Your Bid</CardTitle>
              <CardDescription>
                Current highest bid: <span className="font-bold text-lg">{formatPrice(auction.currentBid)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bidAmount">Bid Amount</Label>
                <Input
                  id="bidAmount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: ${formatPrice(auction.currentBid + auction.bidIncrement)}`}
                  min={auction.currentBid + auction.bidIncrement}
                  step={auction.bidIncrement}
                />
                <Muted className="text-xs">
                  Bid increment: {formatPrice(auction.bidIncrement)}
                </Muted>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePlaceBid} className="flex-1" disabled={auction.status !== 'active'}>
                  <Gavel className="h-4 w-4 mr-2" />
                  Place Bid
                </Button>
                <Button
                  variant="outline"
                  onClick={handleQuickBid}
                  disabled={auction.status !== 'active'}
                >
                  Quick Bid (+{formatPrice(auction.bidIncrement)})
                </Button>
              </div>
              {auction.status !== 'active' && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <P className="text-sm">
                    {auction.status === 'ended' ? 'This auction has ended' : 'Auction not yet started'}
                  </P>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bid History */}
          <Card>
            <CardHeader>
              <CardTitle>Bid History</CardTitle>
              <CardDescription>{auction.bidCount} bids placed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auction.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      bid.isWinning ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {bid.userAvatar ? (
                          <AvatarImage src={bid.userAvatar} alt={bid.userName} />
                        ) : null}
                        <AvatarFallback>{bid.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <P className="text-sm font-semibold">{bid.userName}</P>
                        <Muted className="text-xs">
                          {formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}
                        </Muted>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <P className="font-bold">{formatPrice(bid.amount)}</P>
                      {bid.isWinning && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Winning
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Auction Info */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Muted className="text-xs">Starting Bid</Muted>
                <P className="font-semibold">{formatPrice(auction.startingBid)}</P>
              </div>
              <div>
                <Muted className="text-xs">Current Bid</Muted>
                <P className="font-semibold text-lg">{formatPrice(auction.currentBid)}</P>
              </div>
              <div>
                <Muted className="text-xs">Bid Increment</Muted>
                <P className="font-semibold">{formatPrice(auction.bidIncrement)}</P>
              </div>
              <div>
                <Muted className="text-xs">End Time</Muted>
                <P className="font-semibold">
                  {format(new Date(auction.endTime), 'MMM dd, yyyy h:mm a')}
                </P>
              </div>
              <div>
                <Muted className="text-xs">Total Bids</Muted>
                <P className="font-semibold">{auction.bidCount}</P>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Bids are binding and cannot be withdrawn</li>
                <li>• You'll be notified if you're outbid</li>
                <li>• Auction may extend if bids come in last minute</li>
                <li>• Payment required within 24 hours of winning</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveAuctionPage;

