import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/dummyData';
import { H1, P, Large, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <H1 className="mb-4">Product Not Found</H1>
        <P className="text-lg text-muted-foreground">
          The product you are looking for does not exist.
        </P>
        <Link to="/products">
          <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`);
    // In a real app, you would add this to a global state/context for the cart
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div className="relative overflow-hidden rounded-lg shadow-xl">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="space-y-6">
        <H1 className="text-4xl font-bold">{product.name}</H1>
        <P className="text-3xl font-bold text-accent-gold">
          ${product.price.toFixed(2)}
        </P>
        <P className="text-lg text-foreground leading-relaxed">
          {product.description}
        </P>
        <div className="space-y-2">
          <Large>Category: <span className="font-normal text-muted-foreground">{product.category}</span></Large>
          <Large>Availability: <span className="font-normal text-muted-foreground">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></Large>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Link to="/products">
          <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductDetailPage;