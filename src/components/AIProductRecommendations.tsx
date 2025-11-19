import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Heart, ShoppingBag, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import ProductCard from '@/components/ProductCard';
import { P, Muted } from '@/components/ui/typography';
import { toast } from 'sonner';

interface AIProductRecommendationsProps {
  productId?: string;
  type?: 'related' | 'cross-sell' | 'upsell' | 'personalized' | 'trending' | 'new';
  limit?: number;
  title?: string;
  showAlgorithm?: boolean;
}

const AIProductRecommendations: React.FC<AIProductRecommendationsProps> = ({
  productId,
  type = 'personalized',
  limit = 8,
  title,
  showAlgorithm = false,
}) => {
  const { formatPrice } = useCurrency();
  const { isInWishlist, addToWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { recentlyViewed } = useRecentlyViewed();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('hybrid');

  // AI Recommendation Algorithms
  const recommendations = useMemo(() => {
    let recommendedProducts = [...products];

    switch (type) {
      case 'related':
        if (productId) {
          const currentProduct = products.find((p) => p.id === productId);
          if (currentProduct) {
            // Content-based filtering: same category, similar price range
            recommendedProducts = products
              .filter(
                (p) =>
                  p.id !== productId &&
                  (p.category === currentProduct.category ||
                    Math.abs(p.price - currentProduct.price) < currentProduct.price * 0.3)
              )
              .slice(0, limit);
          }
        }
        break;

      case 'cross-sell':
        // Complementary products (different categories that go well together)
        if (productId) {
          const currentProduct = products.find((p) => p.id === productId);
          if (currentProduct) {
            const categoryMap: Record<string, string[]> = {
              'Watches': ['Jewelry', 'Accessories'],
              'Handbags': ['Wallets', 'Accessories'],
              'Shoes': ['Socks', 'Accessories'],
              'Clothing': ['Accessories', 'Jewelry'],
            };
            const complementaryCategories = categoryMap[currentProduct.category] || [];
            recommendedProducts = products
              .filter(
                (p) =>
                  p.id !== productId &&
                  (complementaryCategories.includes(p.category) || p.category !== currentProduct.category)
              )
              .slice(0, limit);
          }
        }
        break;

      case 'upsell':
        // Higher-priced alternatives
        if (productId) {
          const currentProduct = products.find((p) => p.id === productId);
          if (currentProduct) {
            recommendedProducts = products
              .filter(
                (p) =>
                  p.id !== productId &&
                  p.category === currentProduct.category &&
                  p.price > currentProduct.price
              )
              .sort((a, b) => a.price - b.price)
              .slice(0, limit);
          }
        }
        break;

      case 'personalized':
        // Hybrid recommendation based on user behavior
        if (user) {
          // Combine multiple signals
          const viewedCategories = recentlyViewed.map((p) => p.category);
          const categoryPreferences = viewedCategories.reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          recommendedProducts = products
            .map((p) => {
              let score = 0;
              // Category preference
              score += (categoryPreferences[p.category] || 0) * 2;
              // Trending bonus
              if (p.isTrending) score += 3;
              // New arrival bonus
              if (p.isNew) score += 2;
              // Rating bonus
              score += (p.rating || 0) * 1.5;
              // Price preference (assume mid-range preference)
              const avgPrice = products.reduce((sum, prod) => sum + prod.price, 0) / products.length;
              score += Math.max(0, 1 - Math.abs(p.price - avgPrice) / avgPrice);
              return { ...p, score };
            })
            .sort((a, b) => (b as any).score - (a as any).score)
            .slice(0, limit)
            .map(({ score, ...product }) => product);
        } else {
          // Fallback to trending for non-authenticated users
          recommendedProducts = products.filter((p) => p.isTrending).slice(0, limit);
        }
        break;

      case 'trending':
        recommendedProducts = products
          .filter((p) => p.isTrending)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limit);
        break;

      case 'new':
        recommendedProducts = products.filter((p) => p.isNew).slice(0, limit);
        break;

      default:
        recommendedProducts = products.slice(0, limit);
    }

    return recommendedProducts;
  }, [productId, type, limit, user, recentlyViewed]);

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'related':
        return 'You May Also Like';
      case 'cross-sell':
        return 'Complete Your Look';
      case 'upsell':
        return 'Premium Alternatives';
      case 'personalized':
        return 'Recommended For You';
      case 'trending':
        return 'Trending Now';
      case 'new':
        return 'New Arrivals';
      default:
        return 'Recommended Products';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'related':
        return <Heart className="h-5 w-5" />;
      case 'cross-sell':
        return <ShoppingBag className="h-5 w-5" />;
      case 'upsell':
        return <Star className="h-5 w-5" />;
      case 'personalized':
        return <Sparkles className="h-5 w-5" />;
      case 'trending':
        return <TrendingUp className="h-5 w-5" />;
      case 'new':
        return <Zap className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-2xl font-bold">{getTitle()}</h3>
          {type === 'personalized' && (
            <Badge variant="outline" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          )}
        </div>
        {showAlgorithm && type === 'personalized' && (
          <div className="flex items-center gap-2">
            <Muted className="text-sm">Algorithm:</Muted>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="hybrid">Hybrid</option>
              <option value="collaborative">Collaborative</option>
              <option value="content">Content-Based</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {type === 'personalized' && user && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <P className="text-sm text-muted-foreground">
            <Sparkles className="h-3 w-3 inline mr-1" />
            Recommendations are personalized based on your browsing history, preferences, and trending items.
          </P>
        </div>
      )}
    </div>
  );
};

export default AIProductRecommendations;

