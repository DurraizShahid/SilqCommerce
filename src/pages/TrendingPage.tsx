import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Eye, 
  Heart, 
  ShoppingCart,
  Sparkles,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatDistanceToNow } from 'date-fns';
import ProductQuickView from '@/components/ProductQuickView';
import { Product } from '@/data/dummyData';

interface TrendingProduct extends Product {
  trendScore: number;
  trendChange: number;
  views24h: number;
  purchases24h: number;
  wishlistAdds24h: number;
}

const TrendingPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState<'all' | 'rising' | 'hot' | 'new'>('all');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [sortBy, setSortBy] = useState<'score' | 'change' | 'views' | 'purchases'>('score');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);

  // Calculate trending scores (mock algorithm)
  const trendingProducts = useMemo(() => {
    return products.map((product): TrendingProduct => {
      // Mock trending data
      const views24h = Math.floor(Math.random() * 1000) + 100;
      const purchases24h = Math.floor(Math.random() * 50) + 5;
      const wishlistAdds24h = Math.floor(Math.random() * 100) + 10;
      const previousScore = Math.random() * 100;
      const currentScore = views24h * 0.3 + purchases24h * 5 + wishlistAdds24h * 2 + (product.rating || 0) * 10;
      const trendChange = ((currentScore - previousScore) / previousScore) * 100;

      return {
        ...product,
        trendScore: currentScore,
        trendChange,
        views24h,
        purchases24h,
        wishlistAdds24h,
      };
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...trendingProducts];

    // Filter by tab
    if (activeTab === 'rising') {
      filtered = filtered.filter(p => p.trendChange > 10);
    } else if (activeTab === 'hot') {
      filtered = filtered.filter(p => p.trendScore > 80);
    } else if (activeTab === 'new') {
      filtered = filtered.filter(p => p.isNew === true);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.trendScore - a.trendScore;
        case 'change':
          return b.trendChange - a.trendChange;
        case 'views':
          return b.views24h - a.views24h;
        case 'purchases':
          return b.purchases24h - a.purchases24h;
        default:
          return 0;
      }
    });

    return filtered;
  }, [trendingProducts, activeTab, sortBy]);

  const topTrending = useMemo(() => {
    return [...trendingProducts]
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, 3);
  }, [trendingProducts]);

  const handleQuickView = (product: Product) => {
    setSelectedProductForQuickView(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <H1 className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Trending Products
          </H1>
          <P className="text-muted-foreground">
            Discover what's hot right now based on real-time engagement
          </P>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Trend Score</SelectItem>
              <SelectItem value="change">Trend Change</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
              <SelectItem value="purchases">Most Purchases</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top 3 Trending */}
      {topTrending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-orange-500" />
            <P className="font-semibold">Top Trending Now</P>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {topTrending.map((product, idx) => (
              <Card key={product.id} className="relative overflow-hidden border-primary/20">
                {idx === 0 && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className="bg-primary text-primary-foreground">
                      <Flame className="h-3 w-3 mr-1" />
                      #1 Trending
                    </Badge>
                  </div>
                )}
                <Link to={`/products/${product.id}`}>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.images?.[0] || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link to={`/products/${product.id}`}>
                        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </CardTitle>
                      </Link>
                      <Muted className="text-sm mt-1">{product.category}</Muted>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <P className="text-2xl font-bold">{formatPrice(product.price)}</P>
                    <div className="flex items-center gap-1">
                      {product.trendChange > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-semibold ${product.trendChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(product.trendChange).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{product.views24h}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.purchases24h}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{product.wishlistAdds24h}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleQuickView(product)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Quick View
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addToWishlist(product)}
                    >
                      <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Trending Products */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="all">All Trending</TabsTrigger>
          <TabsTrigger value="rising">Rising</TabsTrigger>
          <TabsTrigger value="hot">Hot</TabsTrigger>
          <TabsTrigger value="new">New Arrivals</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/products/${product.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.images?.[0] || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.trendChange > 20 && (
                      <Badge className="absolute top-2 left-2 bg-orange-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Rising
                      </Badge>
                    )}
                    {product.trendScore > 90 && (
                      <Badge className="absolute top-2 right-2 bg-red-500">
                        <Flame className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                </Link>
                <CardHeader>
                  <Link to={`/products/${product.id}`}>
                    <CardTitle className="text-base line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                  </Link>
                  <Muted className="text-xs">{product.category}</Muted>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <P className="font-bold">{formatPrice(product.price)}</P>
                    <div className="flex items-center gap-1">
                      {product.trendChange > 0 ? (
                        <ArrowUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs font-semibold ${product.trendChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(product.trendChange).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{product.views24h}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      <span>{product.purchases24h}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick View Dialog */}
      {selectedProductForQuickView && (
        <ProductQuickView
          product={selectedProductForQuickView}
          isOpen={isQuickViewOpen}
          onClose={() => {
            setIsQuickViewOpen(false);
            setSelectedProductForQuickView(null);
          }}
        />
      )}
    </div>
  );
};

export default TrendingPage;
