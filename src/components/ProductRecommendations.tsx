import React from 'react';
import { Product } from '@/data/dummyData';
import { H2, P } from '@/components/ui/typography';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ProductRecommendationsProps {
  product: Product;
  type?: 'cross-sell' | 'upsell' | 'related' | 'trending';
  limit?: number;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  product,
  type = 'related',
  limit = 4,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  // Mock recommendation logic - in real app, this would use ML/AI
  const getRecommendations = (): Product[] => {
    const { products } = require('@/data/dummyData');
    
    switch (type) {
      case 'cross-sell':
        // Products from different categories that complement the current product
        return products
          .filter((p: Product) => p.id !== product.id && p.category !== product.category)
          .slice(0, limit);
      
      case 'upsell':
        // Similar products but more expensive
        return products
          .filter((p: Product) => p.id !== product.id && p.price > product.price)
          .sort((a: Product, b: Product) => a.price - b.price)
          .slice(0, limit);
      
      case 'trending':
        // Products with high ratings and recent activity
        return products
          .filter((p: Product) => p.id !== product.id)
          .sort((a: Product, b: Product) => (b.rating || 0) - (a.rating || 0))
          .slice(0, limit);
      
      case 'related':
      default:
        // Similar products in same category or with similar price range
        return products
          .filter((p: Product) => 
            p.id !== product.id && 
            (p.category === product.category || 
             Math.abs(p.price - product.price) < product.price * 0.3)
          )
          .slice(0, limit);
    }
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) {
    return null;
  }

  const getTitle = () => {
    switch (type) {
      case 'cross-sell':
        return 'Complete Your Look';
      case 'upsell':
        return 'You May Also Like';
      case 'trending':
        return 'Trending Now';
      case 'related':
      default:
        return 'Related Products';
    }
  };

  const handleAddToCart = (recommendedProduct: Product) => {
    addToCart(recommendedProduct);
    toast.success(`${recommendedProduct.name} added to cart`);
  };

  const handleWishlistToggle = (recommendedProduct: Product) => {
    if (isInWishlist(recommendedProduct.id)) {
      removeFromWishlist(recommendedProduct.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(recommendedProduct);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <H2>{getTitle()}</H2>
        <P className="text-muted-foreground">
          {type === 'cross-sell' && 'Products that complement your selection'}
          {type === 'upsell' && 'Premium alternatives you might love'}
          {type === 'trending' && 'What other customers are loving'}
          {type === 'related' && 'Similar products you might like'}
        </P>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((recommendedProduct) => (
          <Card key={recommendedProduct.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/products/${recommendedProduct.id}`}>
              <div className="relative w-full h-64 overflow-hidden">
                <img
                  src={recommendedProduct.imageUrl}
                  alt={recommendedProduct.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {recommendedProduct.isNew && (
                  <Badge className="absolute top-2 left-2">New</Badge>
                )}
                {recommendedProduct.onSale && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    {Math.round(((recommendedProduct.originalPrice || recommendedProduct.price) - recommendedProduct.price) / (recommendedProduct.originalPrice || recommendedProduct.price) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </Link>
            <CardHeader>
              <Link to={`/products/${recommendedProduct.id}`}>
                <CardTitle className="text-lg line-clamp-2">{recommendedProduct.name}</CardTitle>
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-accent-gold">
                  {formatPrice(recommendedProduct.price)}
                </span>
                {recommendedProduct.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(recommendedProduct.originalPrice)}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <P className="text-sm text-muted-foreground line-clamp-2">
                {recommendedProduct.description}
              </P>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handleAddToCart(recommendedProduct)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleWishlistToggle(recommendedProduct)}
                className={isInWishlist(recommendedProduct.id) ? 'text-red-500' : ''}
              >
                <Heart className={`h-4 w-4 ${isInWishlist(recommendedProduct.id) ? 'fill-current' : ''}`} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;

