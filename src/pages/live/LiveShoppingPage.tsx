import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Mic,
  Camera,
  Play,
  Radio,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow, isFuture, isPast } from 'date-fns';
import { toast } from 'sonner';

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostAvatar?: string;
  hostType: 'vendor' | 'influencer' | 'stylist' | 'brand';
  thumbnail: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'live' | 'ended';
  viewerCount: number;
  type: 'shopping' | 'auction' | 'styling' | 'qna';
  category?: string;
  featuredProducts?: string[];
  isScheduled: boolean;
}

const LiveShoppingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'ended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock live events data
  const liveEvents: LiveEvent[] = [
    {
      id: 'e1',
      title: 'Summer Collection Launch',
      description: 'Join us for an exclusive preview of our new summer collection',
      hostName: 'Emma Thompson',
      hostType: 'vendor',
      thumbnail: '/api/placeholder/400/300',
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: 'live',
      viewerCount: 1250,
      type: 'shopping',
      category: 'Fashion',
      featuredProducts: ['prod1', 'prod2', 'prod3'],
      isScheduled: false,
    },
    {
      id: 'e2',
      title: 'Luxury Handbag Auction',
      description: 'Rare designer handbags up for auction',
      hostName: 'Luxury Fashion House',
      hostType: 'brand',
      thumbnail: '/api/placeholder/400/300',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      viewerCount: 0,
      type: 'auction',
      category: 'Accessories',
      isScheduled: true,
    },
    {
      id: 'e3',
      title: 'Live Styling Session with Sophie',
      description: 'Get personalized styling tips from our expert stylist',
      hostName: 'Sophie Laurent',
      hostType: 'stylist',
      thumbnail: '/api/placeholder/400/300',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      viewerCount: 0,
      type: 'styling',
      category: 'Styling',
      isScheduled: true,
    },
    {
      id: 'e4',
      title: 'Influencer Picks: Must-Have Items',
      description: 'Top influencer shares her favorite luxury finds',
      hostName: 'Fashion Influencer',
      hostType: 'influencer',
      thumbnail: '/api/placeholder/400/300',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'ended',
      viewerCount: 3200,
      type: 'shopping',
      category: 'Fashion',
      isScheduled: false,
    },
    {
      id: 'e5',
      title: 'Q&A with Designers',
      description: 'Ask questions directly to our featured designers',
      hostName: 'Design Team',
      hostType: 'vendor',
      thumbnail: '/api/placeholder/400/300',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      status: 'upcoming',
      viewerCount: 0,
      type: 'qna',
      category: 'Fashion',
      isScheduled: true,
    },
  ];

  const filteredEvents = useMemo(() => {
    let filtered = liveEvents;

    // Filter by tab
    if (activeTab === 'live') {
      filtered = filtered.filter(e => e.status === 'live');
    } else if (activeTab === 'upcoming') {
      filtered = filtered.filter(e => e.status === 'upcoming');
    } else if (activeTab === 'ended') {
      filtered = filtered.filter(e => e.status === 'ended');
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.hostName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(e => e.category === categoryFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.type === typeFilter);
    }

    return filtered;
  }, [activeTab, searchQuery, categoryFilter, typeFilter]);

  const liveNow = useMemo(() => {
    return liveEvents.filter(e => e.status === 'live');
  }, []);

  const upcoming = useMemo(() => {
    return liveEvents
      .filter(e => e.status === 'upcoming')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, []);

  const getStatusBadge = (event: LiveEvent) => {
    if (event.status === 'live') {
      return (
        <Badge className="bg-red-500 animate-pulse">
          <Radio className="h-3 w-3 mr-1" />
          LIVE
        </Badge>
      );
    } else if (event.status === 'upcoming') {
      return (
        <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Upcoming
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          Ended
        </Badge>
      );
    }
  };

  const getTypeIcon = (type: LiveEvent['type']) => {
    switch (type) {
      case 'shopping':
        return <ShoppingBag className="h-4 w-4" />;
      case 'auction':
        return <TrendingUp className="h-4 w-4" />;
      case 'styling':
        return <Sparkles className="h-4 w-4" />;
      case 'qna':
        return <Mic className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <H1 className="flex items-center gap-2">
            <Video className="h-8 w-8 text-primary" />
            Live Shopping
          </H1>
          <P className="text-muted-foreground">
            Join live events, auctions, and styling sessions
          </P>
        </div>
        <div className="flex gap-2">
          <Link to="/live/schedule">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Now Banner */}
      {liveNow.length > 0 && (
        <Card className="border-red-500 bg-red-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-red-500 animate-pulse" />
              <CardTitle className="text-red-500">Live Now</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {liveNow.map((event) => (
                <Link key={event.id} to={`/live/${event.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                        <img
                          src={event.thumbnail}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="flex items-center justify-between text-white">
                            <Badge className="bg-red-500 animate-pulse">
                              <Radio className="h-3 w-3 mr-1" />
                              LIVE
                            </Badge>
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="h-4 w-4" />
                              {event.viewerCount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                      <CardDescription>{event.hostName}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Fashion">Fashion</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Styling">Styling</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="auction">Auction</SelectItem>
            <SelectItem value="styling">Styling</SelectItem>
            <SelectItem value="qna">Q&A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events List */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="live">
            Live ({liveNow.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-lg text-muted-foreground">No events found</P>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/live/${event.id}`}>
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.status === 'live' && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 animate-pulse">
                            <Radio className="h-3 w-3 mr-1" />
                            LIVE
                          </Badge>
                        </div>
                      )}
                      {event.status === 'upcoming' && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="outline" className="bg-background/80">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(event.startTime), { addSuffix: true })}
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2">
                        {getTypeIcon(event.type)}
                      </div>
                    </div>
                  </Link>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <Link to={`/live/${event.id}`}>
                          <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                            {event.title}
                          </CardTitle>
                        </Link>
                        <CardDescription className="mt-1">{event.hostName}</CardDescription>
                      </div>
                      {getStatusBadge(event)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <P className="text-sm line-clamp-2">{event.description}</P>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(event.startTime), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(new Date(event.startTime), 'h:mm a')}
                        </span>
                      </div>
                      {event.status === 'live' && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{event.viewerCount.toLocaleString()} watching</span>
                        </div>
                      )}
                    </div>
                    <Link to={`/live/${event.id}`}>
                      <Button className="w-full" variant={event.status === 'live' ? 'default' : 'outline'}>
                        {event.status === 'live' ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Join Live
                          </>
                        ) : event.status === 'upcoming' ? (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            Set Reminder
                          </>
                        ) : (
                          <>
                            <Video className="h-4 w-4 mr-2" />
                            Watch Replay
                          </>
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveShoppingPage;

