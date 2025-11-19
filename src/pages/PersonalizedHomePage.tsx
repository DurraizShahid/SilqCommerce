import React, { useState, useEffect } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Clock, Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { useWishlist } from '@/context/WishlistContext';
import AIProductRecommendations from '@/components/AIProductRecommendations';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import ProductCard from '@/components/ProductCard';
import NewArrivalsFeed from '@/components/NewArrivalsFeed';

const PersonalizedHomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { recentlyViewed } = useRecentlyViewed();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'for-you' | 'trending' | 'new' | 'wishlist'>('for-you');

  // Personalized stats
  const stats = {
    viewedToday: recentlyViewed.length,
    wishlistItems: 0, // Would come from wishlist context
    recommendedCount: 8,
    trendingCount: products.filter((p) => p.isTrending).length,
  };

  // Personalized categories based on viewing history
  const topCategories = React.useMemo(() => {
    const categoryCounts = recentlyViewed.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }, [recentlyViewed]);

  return (
    <div className="space-y-8">
      {/* Personalized Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <H1 className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              {isAuthenticated && user
                ? `Welcome back, ${user.name.split(' ')[0]}`
                : 'Discover Luxury'}
            </H1>
            <P className="text-muted-foreground mt-2">
              {isAuthenticated
                ? 'Your personalized shopping experience, curated just for you'
                : 'Sign in to unlock personalized recommendations'}
            </P>
          </div>
          {!isAuthenticated && (
            <Link to="/login">
              <Button>
                <Sparkles className="h-4 w-4 mr-2" />
                Sign In for Personalization
              </Button>
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        {isAuthenticated && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <P className="text-2xl font-bold">{stats.viewedToday}</P>
                    <Muted className="text-xs">Viewed Today</Muted>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <P className="text-2xl font-bold">{stats.wishlistItems}</P>
                    <Muted className="text-xs">Wishlist Items</Muted>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <P className="text-2xl font-bold">{stats.recommendedCount}</P>
                    <Muted className="text-xs">Recommended</Muted>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <P className="text-2xl font-bold">{stats.trendingCount}</P>
                    <Muted className="text-xs">Trending</Muted>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Personalized Categories */}
      {isAuthenticated && topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Your Favorite Categories
            </CardTitle>
            <Muted>Based on your browsing history</Muted>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {topCategories.map((category) => (
                <Link key={category} to={`/products?category=${category}`}>
                  <Badge variant="outline" className="text-sm px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="for-you">
            <Sparkles className="h-4 w-4 mr-2" />
            For You
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new">
            <Zap className="h-4 w-4 mr-2" />
            New Arrivals
          </TabsTrigger>
          {isAuthenticated && (
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="for-you" className="space-y-8">
          {/* AI-Powered Recommendations */}
          <AIProductRecommendations
            type="personalized"
            limit={8}
            showAlgorithm={true}
          />

          {/* Continue Shopping */}
          {recentlyViewed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Continue Shopping
                </CardTitle>
                <Muted>Pick up where you left off</Muted>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentlyViewed.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {recentlyViewed.length > 4 && (
                  <div className="mt-4 text-center">
                    <Link to="/products">
                      <Button variant="outline">View All Recently Viewed</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trending">
          <AIProductRecommendations type="trending" limit={12} />
        </TabsContent>

        <TabsContent value="new">
          <NewArrivalsFeed />
          <div className="mt-8">
            <AIProductRecommendations type="new" limit={12} />
          </div>
        </TabsContent>

        {isAuthenticated && (
          <TabsContent value="wishlist">
            <Card>
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-lg text-muted-foreground mb-2">Your wishlist items</P>
                <Link to="/wishlist">
                  <Button>View Wishlist</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PersonalizedHomePage;

