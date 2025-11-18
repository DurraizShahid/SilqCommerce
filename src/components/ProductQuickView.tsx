import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { P, Large, Muted } from '@/components/ui/typography';
import { Product } from '@/data/dummyData';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

interface ProductQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addToCart } = useCart();

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart(product);
    onClose(); // Close the quick view after adding to cart
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative h-full min-h-[300px] md:min-h-[500px] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 space-y-4 flex flex-col justify-between">
            <DialogHeader className="text-left">
              <DialogTitle className="text-3xl font-bold">{product.name}</DialogTitle>
              <DialogDescription className="text-lg text-muted-foreground">
                {product.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 flex-grow">
              <P className="text-4xl font-bold text-accent-gold [&:not(:first-child)]:mt-0">
                ${product.price.toFixed(2)}
              </P>
              <div className="space-y-1">
                <Large>Category: <span className="font-normal text-muted-foreground">{product.category}</span></Large>
                <Large>Availability: <span className="font-normal text-muted-foreground">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></Large>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Link to={`/products/${product.id}`} className="w-full">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" onClick={onClose}>
                  View Full Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;