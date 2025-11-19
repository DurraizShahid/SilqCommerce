import React from 'react';
import { H2, P } from '@/components/ui/typography';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';

const RecentlyViewedProducts: React.FC = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  if (recentlyViewed.length === 0) {
    return null;
  }

  const handleAddToCart = (product: typeof recentlyViewed[0]) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <H2>Recently Viewed</H2>
        {recentlyViewed.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearRecentlyViewed}>
            Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentlyViewed.slice(0, 5).map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden">
            <Link to={`/products/${product.id}`}>
              <div className="relative w-full h-40 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </Link>
            <CardHeader className="flex-grow p-3">
              <CardTitle className="text-sm font-semibold line-clamp-2">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <P className="text-lg font-bold text-accent-gold">{formatPrice(product.price)}</P>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 p-3 pt-0">
              <Button
                size="sm"
                className="w-full"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                Add to Cart
              </Button>
              <Link to={`/products/${product.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="h-3 w-3 mr-2" />
                  View
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewedProducts;

