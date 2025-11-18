import React, { useState, useEffect } from 'react';
import { products } from '@/data/dummyData';
import { H1, P } from '@/components/ui/typography';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');

  // Reset search term when category changes
  useEffect(() => {
    setSearchTerm('');
  }, [selectedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <H1 className="mb-2">Our Collection</H1>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of modern luxe fashion and accessories.
        </P>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
        <div className="relative w-full sm:w-1/2 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-md border w-full"
          />
        </div>
        {selectedCategory && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Category: {selectedCategory}
            <Link to="/products" className="ml-2 cursor-pointer">
              <X className="h-4 w-4" />
            </Link>
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-60 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                <P className="text-sm text-muted-foreground mt-2 line-clamp-2 [&:not(:first-child)]:mt-2">
                  {product.description}
                </P>
              </CardHeader>
              <CardContent>
                <P className="text-2xl font-bold text-accent-gold [&:not(:first-child)]:mt-0">
                  ${product.price.toFixed(2)}
                </P>
              </CardContent>
              <CardFooter>
                <Link to={`/products/${product.id}`} className="w-full">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <P className="text-xl text-muted-foreground">No products found matching your criteria.</P>
            <Link to="/products">
              <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;