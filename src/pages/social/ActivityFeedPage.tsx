import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Heart, MessageCircle, Share2, ShoppingBag, Star, UserPlus } from 'lucide-react';
import ActivityFeedCard from '@/components/social/ActivityFeedCard';
import { products, vendors } from '@/data/dummyData';

const ActivityFeedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'trending'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock activity feed data
  const activities = useMemo(() => [
    {
      id: 'act1',
      type: 'purchase' as const,
      user: {
        id: 'user1',
        name: 'Sarah Johnson',
        avatar: undefined,
      },
      product: {
        id: products[0].id,
        name: products[0].name,
        image: products[0].images[0],
        price: products[0].price,
      },
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      likes: 12,
      comments: 3,
    },
    {
      id: 'act2',
      type: 'review' as const,
      user: {
        id: 'user2',
        name: 'Michael Chen',
        avatar: undefined,
      },
      product: {
        id: products[1].id,
        name: products[1].name,
        image: products[1].images[0],
        price: products[1].price,
      },
      content: 'Amazing quality! Highly recommend this product.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      comments: 2,
    },
    {
      id: 'act3',
      type: 'wishlist' as const,
      user: {
        id: 'user3',
        name: 'Emma Williams',
        avatar: undefined,
      },
      product: {
        id: products[2].id,
        name: products[2].name,
        image: products[2].images[0],
        price: products[2].price,
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 5,
      comments: 1,
    },
    {
      id: 'act4',
      type: 'follow' as const,
      user: {
        id: 'user4',
        name: 'David Brown',
        avatar: undefined,
      },
      vendor: {
        id: vendors[0].id,
        name: vendors[0].name,
        logo: vendors[0].logoUrl,
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      likes: 2,
      comments: 0,
    },
    {
      id: 'act5',
      type: 'share' as const,
      user: {
        id: 'user5',
        name: 'Lisa Anderson',
        avatar: undefined,
      },
      product: {
        id: products[3].id,
        name: products[3].name,
        image: products[3].images[0],
        price: products[3].price,
      },
      content: 'Check out this amazing find!',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      likes: 15,
      comments: 4,
    },
  ], []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesType = filterType === 'all' || activity.type === filterType;
      const matchesSearch =
        !searchQuery ||
        activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.vendor?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [activities, filterType, searchQuery]);

  const handleLike = (activityId: string) => {
    // Handle like action
    console.log('Like activity:', activityId);
  };

  const handleComment = (activityId: string) => {
    // Handle comment action
    console.log('Comment on activity:', activityId);
  };

  const handleShare = (activityId: string) => {
    // Handle share action
    console.log('Share activity:', activityId);
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Activity Feed</H1>
        <P className="text-muted-foreground">See what your community is up to</P>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="purchase">Purchases</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="wishlist">Wishlist</SelectItem>
                <SelectItem value="follow">Follows</SelectItem>
                <SelectItem value="share">Shares</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredActivities.map((activity) => (
            <ActivityFeedCard
              key={activity.id}
              activity={activity}
              onLike={() => handleLike(activity.id)}
              onComment={() => handleComment(activity.id)}
              onShare={() => handleShare(activity.id)}
            />
          ))}
          {filteredActivities.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <P className="text-muted-foreground">No activities found matching your filters.</P>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center">
              <P className="text-muted-foreground">
                Activities from people you follow will appear here.
              </P>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          {filteredActivities
            .filter((a) => (a.likes || 0) > 10)
            .map((activity) => (
              <ActivityFeedCard
                key={activity.id}
                activity={activity}
                onLike={() => handleLike(activity.id)}
                onComment={() => handleComment(activity.id)}
                onShare={() => handleShare(activity.id)}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityFeedPage;

