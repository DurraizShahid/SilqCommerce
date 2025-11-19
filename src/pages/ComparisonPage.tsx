import React from 'react';
import { Link } from 'react-router-dom';
import { H1, P } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useComparison } from '@/context/ComparisonContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { X, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ComparisonPage: React.FC = () => {
  const { comparisonProducts, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  if (comparisonProducts.length === 0) {
    return (
      <div className="text-center space-y-6 py-16">
        <H1>No Products to Compare</H1>
        <P className="text-muted-foreground">Add products to comparison to see them side by side.</P>
        <Link to="/products">
          <Button variant="outline">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const attributes = [
    { label: 'Price', key: 'price' },
    { label: 'Category', key: 'category' },
    { label: 'Stock', key: 'stock' },
    { label: 'Description', key: 'description' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <H1>Product Comparison</H1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearComparison}>
            Clear All
          </Button>
          <Link to="/products">
            <Button variant="outline">Add More Products</Button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-4 text-left sticky left-0 bg-background z-10 min-w-[200px]">
                  <P className="font-semibold">Attribute</P>
                </th>
                {comparisonProducts.map((product) => (
                  <th key={product.id} className="border p-4 text-center min-w-[250px] relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeFromComparison(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="space-y-4">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr.key}>
                  <td className="border p-4 font-semibold sticky left-0 bg-background z-10">
                    {attr.label}
                  </td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="border p-4 text-center">
                      {attr.key === 'price' ? (
                        <P className="text-lg font-bold text-accent-gold">
                          {formatPrice(product.price)}
                        </P>
                      ) : attr.key === 'stock' ? (
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </Badge>
                      ) : (
                        <P className="text-sm text-muted-foreground">
                          {product[attr.key as keyof typeof product] as string}
                        </P>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="border p-4 font-semibold sticky left-0 bg-background z-10">
                  Actions
                </td>
                {comparisonProducts.map((product) => (
                  <td key={product.id} className="border p-4">
                    <div className="flex flex-col gap-2">
                      <Link to={`/products/${product.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        className="w-full"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;

