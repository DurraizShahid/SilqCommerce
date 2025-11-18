import React, { useState, useEffect, useMemo } from 'react';
import { products } from '@/data/dummyData';
import { H1, P } from '@/components/ui/typography';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { X, Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductQuickView from '@/components/ProductQuickView';
import { Product } from '@/data/dummyData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PaginationControls from '@/components/PaginationControls'; // Import PaginationControls

const PRODUCTS_PER_PAGE = 8; // Define how many products per page

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState(1); // New state for current page

  // Reset search term, sort order, and current page when category changes
  useEffect(() => {
    setSearchTerm('');
    setSortOrder('default');
    setCurrentPage(1); // Reset to first page on category change
  }, [selectedCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = products.filter((product) => {
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Apply sorting
    switch (sortOrder) {
      case 'price-asc':
        currentProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        currentProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        currentProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        currentProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // No specific sorting, maintain original order or a default one
        break;
    }
    return currentProducts;
  }, [products, selectedCategory, searchTerm, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  const handleQuickView = (product: Product) => {
    setSelectedProductForQuickView(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <H1 className="mb-2">Our Collection</H1>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of modern luxe fashion and accessories.
        </P>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
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
        <div className="flex items-center gap-4">
          {selectedCategory && (
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Category: {selectedCategory}
              <Link to="/products" className="ml-2 cursor-pointer">
                <X className="h-4 w-4" />
              </Link>
            </Badge>
          )}
          <Select onValueChange={setSortOrder} value={sortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
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
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => handleQuickView(product)}
                >
                  <Eye className="h-4 w-4 mr-2" /> Quick View
                </Button>
                <Link to={`/products/${product.id}`} className="w-full">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
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

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <ProductQuickView
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProductForQuickView}
      />
    </div>
  );
};

export default ProductsPage;