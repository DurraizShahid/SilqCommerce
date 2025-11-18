import React from 'react';
import { categories, products } from '@/data/dummyData';
import { H1, P } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const CategoriesPage: React.FC = () => {
  const getCategoryImageUrl = (categoryName: string) => {
    const product = products.find(p => p.category === categoryName);
    return product ? product.imageUrl : 'https://via.placeholder.com/400x300?text=Category';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <H1 className="mb-2">Explore Categories</H1>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our exquisite collections by category.
        </P>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link to={`/products?category=${category.name}`} key={category.id}>
            <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="relative w-full h-60 overflow-hidden">
                <img
                  src={getCategoryImageUrl(category.name)}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="flex-grow text-center">
                <CardTitle className="text-2xl font-semibold">{category.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;