import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products, categories } from '@/data/dummyData';
import { P, Muted } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (query: string) => void;
  onClear: () => void;
  maxSuggestions?: number;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSelect,
  onClear,
  maxSuggestions = 8,
}) => {
  const [suggestions, setSuggestions] = useState<{
    products: typeof products;
    categories: typeof categories;
    history: string[];
    trending: string[];
  }>({
    products: [],
    categories: [],
    history: [],
    trending: [],
  });

  useEffect(() => {
    if (!query.trim()) {
      // Show recent searches and trending when no query
      const history = JSON.parse(localStorage.getItem('search_history') || '[]');
      setSuggestions({
        products: [],
        categories: [],
        history: history.slice(0, 5).map((item: any) => item.query),
        trending: ['luxury watch', 'designer bag', 'silk scarf', 'leather shoes'],
      });
      return;
    }

    const queryLower = query.toLowerCase();
    
    // Product suggestions
    const productMatches = products
      .filter((p) => 
        p.name.toLowerCase().includes(queryLower) ||
        p.description.toLowerCase().includes(queryLower) ||
        p.category.toLowerCase().includes(queryLower)
      )
      .slice(0, maxSuggestions);

    // Category suggestions
    const categoryMatches = categories
      .filter((c) => c.name.toLowerCase().includes(queryLower))
      .slice(0, 3);

    // Search history matches
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    const historyMatches = history
      .filter((item: any) => item.query.toLowerCase().includes(queryLower))
      .map((item: any) => item.query)
      .slice(0, 3);

    setSuggestions({
      products: productMatches,
      categories: categoryMatches,
      history: historyMatches,
      trending: [],
    });
  }, [query, maxSuggestions]);

  if (!query.trim() && suggestions.history.length === 0 && suggestions.trending.length === 0) {
    return null;
  }

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-lg">
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {/* Recent Searches */}
          {suggestions.history.length > 0 && (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <Muted className="text-xs font-semibold uppercase">Recent Searches</Muted>
                <button
                  onClick={onClear}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {suggestions.history.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(item)}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <P className="text-sm">{item}</P>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {suggestions.trending.length > 0 && (
            <div className="p-4 border-b">
              <Muted className="text-xs font-semibold uppercase mb-2 block">Trending</Muted>
              <div className="space-y-1">
                {suggestions.trending.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect(item)}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <P className="text-sm">{item}</P>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Suggestions */}
          {suggestions.categories.length > 0 && (
            <div className="p-4 border-b">
              <Muted className="text-xs font-semibold uppercase mb-2 block">Categories</Muted>
              <div className="space-y-1">
                {suggestions.categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.id}`}
                    className="block px-3 py-2 hover:bg-muted rounded-md"
                  >
                    <P className="text-sm">{category.name}</P>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Suggestions */}
          {suggestions.products.length > 0 && (
            <div className="p-4">
              <Muted className="text-xs font-semibold uppercase mb-2 block">Products</Muted>
              <div className="space-y-2">
                {suggestions.products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-md"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <P className="text-sm font-medium truncate">{product.name}</P>
                      <Muted className="text-xs">{product.category}</Muted>
                    </div>
                    {product.isTrending && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.trim() && 
           suggestions.products.length === 0 && 
           suggestions.categories.length === 0 && (
            <div className="p-4 text-center">
              <P className="text-sm text-muted-foreground">
                No suggestions found for "{query}"
              </P>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchSuggestions;

