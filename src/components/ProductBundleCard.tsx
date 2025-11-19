import React from 'react';
import { ProductBundle } from '@/data/dummyData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { P } from '@/components/ui/typography';

interface ProductBundleCardProps {
  bundle: ProductBundle;
}

const ProductBundleCard: React.FC<ProductBundleCardProps> = ({ bundle }) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const handleAddBundleToCart = () => {
    bundle.products.forEach(product => {
      addToCart(product, 1);
    });
    toast.success(`${bundle.name} added to cart!`);
  };

  const originalPrice = bundle.products.reduce((sum, p) => sum + p.price, 0);
  const savings = originalPrice - bundle.bundlePrice;

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={bundle.imageUrl}
          alt={bundle.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-4 right-4 bg-accent-gold text-accent-gold-foreground">
          <Tag className="h-3 w-3 mr-1" />
          {bundle.discount}% OFF
        </Badge>
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="text-xl font-semibold">{bundle.name}</CardTitle>
        <P className="text-sm text-muted-foreground mt-2 line-clamp-2">{bundle.description}</P>
        <div className="mt-4 space-y-1">
          <P className="text-xs text-muted-foreground">Includes:</P>
          <ul className="text-xs text-muted-foreground space-y-1">
            {bundle.products.map((product, idx) => (
              <li key={product.id}>• {product.name}</li>
            ))}
          </ul>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <P className="text-2xl font-bold text-accent-gold">{formatPrice(bundle.bundlePrice)}</P>
            <P className="text-sm text-muted-foreground line-through">{formatPrice(originalPrice)}</P>
          </div>
          <P className="text-xs text-green-600 font-semibold">Save {formatPrice(savings)}</P>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleAddBundleToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add Bundle to Cart
        </Button>
        <Link to={`/bundles/${bundle.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Bundle Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductBundleCard;

