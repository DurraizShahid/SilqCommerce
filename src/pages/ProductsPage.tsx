import React, { useState, useEffect, useMemo } from 'react';
import { products } from '@/data/dummyData';
import { H1, P } from '@/components/ui/typography';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { X, Search, Eye, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ProductQuickView from '@/components/ProductQuickView';
import { Product } from '@/data/dummyData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useCurrency } from '@/context/CurrencyContext';
import PaginationControls from '@/components/PaginationControls';
import { useWishlist } from '@/context/WishlistContext';
import { useComparison } from '@/context/ComparisonContext';
import { GitCompare, TrendingUp, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedSearchFilters from '@/components/AdvancedSearchFilters';
import { vendors } from '@/data/dummyData';
import { toast } from 'sonner';

const PRODUCTS_PER_PAGE = 8; // Define how many products per page

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToComparison, isInComparison, canAddMore, comparisonProducts: comparisonItems } = useComparison();
  const { formatPrice } = useCurrency();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const maxPrice = useMemo(() => Math.ceil(Math.max(...products.map((product) => product.price))), []);

  // Reset search term, sort order, and current page when category changes
  useEffect(() => {
    setSearchTerm('');
    setSortOrder('default');
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (priceRange[1] === 0) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice, priceRange]);

  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = products.filter((product) => {
      const matchesCategoryFilter = selectedCategory
        ? product.category === selectedCategory
        : true;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = inStockOnly ? product.stock > 0 : true;
      const matchesAdvancedCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesVendor = selectedVendors.length === 0 || (product.vendorId && selectedVendors.some(v => vendors.find(vd => vd.id === product.vendorId)?.name === v));
      const matchesTab = activeTab === 'all'
        ? true 
        : activeTab === 'trending' 
          ? product.isTrending === true
          : activeTab === 'new'
            ? product.isNew === true
            : true;
      return matchesCategoryFilter && matchesSearch && matchesPrice && matchesStock && matchesTab && matchesAdvancedCategory && matchesVendor;
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
          }, [products, selectedCategory, searchTerm, sortOrder, priceRange, inStockOnly, activeTab, selectedCategories, selectedVendors]);

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="new">
            <Sparkles className="h-4 w-4 mr-2" />
            New Arrivals
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
        <div className="flex flex-wrap items-center gap-4">
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

              <AdvancedSearchFilters
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                maxPrice={maxPrice}
                inStockOnly={inStockOnly}
                onInStockOnlyChange={setInStockOnly}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                selectedVendors={selectedVendors}
                onVendorsChange={setSelectedVendors}
                ratingFilter={ratingFilter}
                onRatingFilterChange={setRatingFilter}
                onSaveSearch={() => toast.info('Search saved!')}
              />

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
                <div className="absolute top-2 left-2 flex gap-2">
                  {product.isNew && (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      <Sparkles className="h-3 w-3 mr-1" />
                      New
                    </Badge>
                  )}
                  {product.isTrending && (
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                <P className="text-sm text-muted-foreground mt-2 line-clamp-2 [&:not(:first-child)]:mt-2">
                  {product.description}
                </P>
              </CardHeader>
              <CardContent>
                <P className="text-2xl font-bold text-accent-gold [&:not(:first-child)]:mt-0">
                  {formatPrice(product.price)}
                </P>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => handleQuickView(product)}
                >
                  <Eye className="h-4 w-4 mr-2" /> Quick View
                </Button>
                <div className="flex gap-2 w-full">
                  <Button
                    type="button"
                    variant={isInWishlist(product.id) ? "secondary" : "outline"}
                    className="flex-1"
                    onClick={() => addToWishlist(product)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                    {isInWishlist(product.id) ? "Saved" : "Wishlist"}
                  </Button>
                  <Button
                    type="button"
                    variant={isInComparison(product.id) ? "secondary" : "outline"}
                    size="icon"
                    onClick={() => addToComparison(product)}
                    disabled={!canAddMore && !isInComparison(product.id)}
                    title={isInComparison(product.id) ? "In comparison" : "Add to comparison"}
                  >
                    <GitCompare className="h-4 w-4" />
                  </Button>
                </div>
                <Link to={`/products/${product.id}`} className="w-full">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    View Details
                  </Button>
                </Link>
                {comparisonItems.length > 0 && (
                  <Link to="/compare" className="w-full">
                    <Button variant="outline" className="w-full text-sm">
                      View Comparison ({comparisonItems.length})
                    </Button>
                  </Link>
                )}
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