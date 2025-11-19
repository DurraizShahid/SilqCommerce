import React from 'react';
import { Product } from '@/data/dummyData';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { P } from '@/components/ui/typography';
import { Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { formatPrice } = useCurrency();

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-full h-60 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
        <P className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</P>
      </CardHeader>
      <CardContent>
        <P className="text-2xl font-bold text-accent-gold">{formatPrice(product.price)}</P>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {onQuickView && (
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onQuickView(product)}
          >
            <Eye className="h-4 w-4 mr-2" /> Quick View
          </Button>
        )}
        <Link to={`/products/${product.id}`} className="w-full">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

