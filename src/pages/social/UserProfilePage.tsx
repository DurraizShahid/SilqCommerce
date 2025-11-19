import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, 
  Users, 
  Heart, 
  ShoppingBag, 
  Star, 
  Grid3x3, 
  Calendar,
  MapPin,
  Link as LinkIcon,
  Mail,
  Share2,
  Settings,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import SocialProofBadge from '@/components/social/SocialProofBadge';
import ActivityFeedCard from '@/components/social/ActivityFeedCard';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { formatPrice } = useCurrency();
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'collections' | 'activity' | 'reviews'>('products');

  // Mock user data
  const user = useMemo(() => ({
    id: userId || 'user1',
    name: 'Sarah Johnson',
    username: '@sarahj',
    bio: 'Fashion enthusiast and luxury collector. Sharing my favorite finds and style inspiration.',
    avatar: undefined,
    coverImage: undefined,
    location: 'New York, NY',
    website: 'https://sarahj.com',
    joinDate: '2023-01-15',
    followers: 1250,
    following: 342,
    products: 89,
    collections: 12,
    reviews: 45,
    isVerified: true,
    isFollowing: isFollowing,
  }), [userId, isFollowing]);

  // Mock user products/collections
  const userProducts = products.slice(0, 6);
  const userCollections = [
    { id: 'c1', name: 'Summer Essentials', count: 12, image: products[0].images[0] },
    { id: 'c2', name: 'Luxury Bags', count: 8, image: products[1].images[0] },
    { id: 'c3', name: 'Designer Dresses', count: 15, image: products[2].images[0] },
  ];

  // Mock activity
  const activities = useMemo(() => [
    {
      id: 'act1',
      type: 'purchase' as const,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      product: {
        id: products[0].id,
        name: products[0].name,
        image: products[0].images[0],
        price: products[0].price,
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      comments: 3,
    },
  ], [user, products]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-accent-gold/20 to-primary/20">
          {user.coverImage && (
            <img
              src={user.coverImage}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-shrink-0 -mt-16 sm:-mt-20">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <H1 className="text-2xl">{user.name}</H1>
                    {user.isVerified && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <P className="text-muted-foreground mb-2">{user.username}</P>
                  {user.bio && (
                    <P className="text-sm mb-3">{user.bio}</P>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-primary"
                      >
                        <LinkIcon className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant={isFollowing ? 'outline' : 'default'}
                    size="sm"
                    onClick={handleFollow}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-4 border-t">
                <div className="text-center">
                  <P className="text-2xl font-bold">{user.followers.toLocaleString()}</P>
                  <Muted className="text-sm">Followers</Muted>
                </div>
                <div className="text-center">
                  <P className="text-2xl font-bold">{user.following.toLocaleString()}</P>
                  <Muted className="text-sm">Following</Muted>
                </div>
                <div className="text-center">
                  <P className="text-2xl font-bold">{user.products}</P>
                  <Muted className="text-sm">Products</Muted>
                </div>
                <div className="text-center">
                  <P className="text-2xl font-bold">{user.collections}</P>
                  <Muted className="text-sm">Collections</Muted>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="products">Products ({userProducts.length})</TabsTrigger>
          <TabsTrigger value="collections">Collections ({userCollections.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({user.reviews})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/products/${product.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <CardContent className="pt-4">
                  <Link to={`/products/${product.id}`}>
                    <P className="font-semibold mb-1 hover:underline">{product.name}</P>
                  </Link>
                  <div className="flex items-center justify-between">
                    <P className="font-bold">{formatPrice(product.price)}</P>
                    <SocialProofBadge type="trending" count={Math.floor(Math.random() * 100)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userCollections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/collections/${collection.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <P className="text-xl font-bold mb-1">{collection.name}</P>
                        <Muted className="text-white/80">{collection.count} items</Muted>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {activities.map((activity) => (
            <ActivityFeedCard
              key={activity.id}
              activity={activity}
            />
          ))}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <P className="text-muted-foreground">Reviews will appear here</P>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;

