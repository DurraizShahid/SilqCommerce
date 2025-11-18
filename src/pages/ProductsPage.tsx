import React from 'react';
import { products } from '@/data/dummyData';
import { H1, P } from '@/components/ui/typography';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ProductsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <H1 className="mb-2">Our Collection</H1>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of modern luxe fashion and accessories.
        </P>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
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
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;