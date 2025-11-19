import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { products, categories } from '@/data/dummyData';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, Filter, Save, Trash2, Camera } from 'lucide-react';
import VisualSearchButton from '@/components/VisualSearchButton';
import VoiceSearchButton from '@/components/VoiceSearchButton';
import SearchSuggestions from '@/components/SearchSuggestions';
import NaturalLanguageSearch from '@/components/NaturalLanguageSearch';
import AIPoweredFilters from '@/components/AIPoweredFilters';
import { useCurrency } from '@/context/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  resultCount: number;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: Record<string, any>;
  createdAt: string;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortOrder, setSortOrder] = useState<string>('relevance');
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [activeTab, setActiveTab] = useState<'results' | 'history' | 'saved'>('results');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    setSearchHistory(history);
    
    // Load saved searches from localStorage
    const saved = JSON.parse(localStorage.getItem('saved_searches') || '[]');
    setSavedSearches(saved);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description.toLowerCase().includes(query);
      const matchesCategory = product.category.toLowerCase().includes(query);
      return matchesName || matchesDescription || matchesCategory;
    });
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setSearchParams({ q: query });
    
    // Calculate results count for this query
    const queryLower = query.toLowerCase();
    const results = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(queryLower);
      const matchesDescription = product.description.toLowerCase().includes(queryLower);
      const matchesCategory = product.category.toLowerCase().includes(queryLower);
      return matchesName || matchesDescription || matchesCategory;
    });
    
    // Add to search history
    const historyItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date().toISOString(),
      resultCount: results.length,
    };
    
    const updatedHistory = [
      historyItem,
      ...searchHistory.filter((item) => item.query !== query),
    ].slice(0, 10); // Keep last 10 searches
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('search_history', JSON.stringify(updatedHistory));
  };

  const handleSaveSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    const savedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchQuery,
      query: searchQuery,
      filters: { sortOrder },
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedSearches, savedSearch];
    setSavedSearches(updated);
    localStorage.setItem('saved_searches', JSON.stringify(updated));
    toast.success('Search saved!');
  };

  const handleDeleteSavedSearch = (id: string) => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem('saved_searches', JSON.stringify(updated));
    toast.success('Saved search deleted');
  };

  const handleLoadSavedSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query);
    setSortOrder(savedSearch.filters.sortOrder || 'relevance');
    setSearchParams({ q: savedSearch.query });
    setActiveTab('results');
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search_history');
    toast.success('Search history cleared');
  };

  const sortedResults = useMemo(() => {
    const results = [...searchResults];
    switch (sortOrder) {
      case 'price-asc':
        return results.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return results.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return results.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return results.sort((a, b) => b.name.localeCompare(a.name));
      case 'newest':
        return results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:
        return results;
    }
  }, [searchResults, sortOrder]);

  return (
    <div className="space-y-8">
      <div>
        <H1>Search</H1>
        <P className="text-muted-foreground">Find exactly what you're looking for</P>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="standard">Standard Search</TabsTrigger>
              <TabsTrigger value="natural">Natural Language</TabsTrigger>
            </TabsList>
            <TabsContent value="standard" className="mt-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search products, categories, brands..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(searchQuery);
                        setShowSuggestions(false);
                      }
                    }}
                    className="pl-10"
                  />
                  {showSuggestions && (
                    <SearchSuggestions
                      query={searchQuery}
                      onSelect={(query) => {
                        setSearchQuery(query);
                        handleSearch(query);
                        setShowSuggestions(false);
                      }}
                      onClear={() => {
                        setSearchHistory([]);
                        localStorage.removeItem('search_history');
                      }}
                    />
                  )}
                </div>
                <VoiceSearchButton
                  onTranscript={(text) => {
                    setSearchQuery(text);
                    handleSearch(text);
                  }}
                />
                <VisualSearchButton />
                <Button onClick={() => handleSearch(searchQuery)}>
                  Search
                </Button>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchParams({});
                      setShowSuggestions(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TabsContent>
            <TabsContent value="natural" className="mt-4">
              <NaturalLanguageSearch
                onSearch={(query, filters) => {
                  setSearchQuery(query);
                  handleSearch(query);
                  // Apply filters from natural language parsing
                  // This would integrate with your filter system
                }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI-Powered Filters */}
      <AIPoweredFilters
        onApplyFilters={(filters) => {
          // Apply AI-generated filters
          // This would integrate with your existing filter system
          toast.success('AI filters applied!');
        }}
        onClearFilters={() => {
          // Clear all filters
        }}
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="results">
            Results {searchQuery && `(${sortedResults.length})`}
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({searchHistory.length})
          </TabsTrigger>
          <TabsTrigger value="saved">
            Saved Searches ({savedSearches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          {searchQuery ? (
            <>
              <div className="flex justify-between items-center">
                <P className="text-muted-foreground">
                  Found {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </P>
                <div className="flex gap-4 items-center">
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={handleSaveSearch}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Search
                  </Button>
                </div>
              </div>

              {sortedResults.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <P className="text-lg text-muted-foreground mb-2">No results found</P>
                    <P className="text-sm text-muted-foreground">
                      Try adjusting your search terms or browse our categories
                    </P>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedResults.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <Link to={`/products/${product.id}`}>
                        <div className="relative w-full h-64 overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          {product.isNew && (
                            <Badge className="absolute top-2 left-2">New</Badge>
                          )}
                          {product.onSale && (
                            <Badge variant="destructive" className="absolute top-2 right-2">
                              Sale
                            </Badge>
                          )}
                        </div>
                      </Link>
                      <CardHeader>
                        <Link to={`/products/${product.id}`}>
                          <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                        </Link>
                        <P className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {product.description}
                        </P>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-accent-gold">
                            {formatPrice(product.price)}
                          </span>
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm">{product.rating}</span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-lg text-muted-foreground mb-2">Start searching</P>
                <P className="text-sm text-muted-foreground">
                  Enter a search term above to find products
                </P>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {searchHistory.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-muted-foreground">No search history</P>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleClearHistory}>
                  Clear History
                </Button>
              </div>
              <div className="space-y-2">
                {searchHistory.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleLoadSavedSearch({ id: item.id, name: item.query, query: item.query, filters: {}, createdAt: item.timestamp })}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <P className="font-semibold">{item.query}</P>
                          <Muted className="text-sm">
                            {new Date(item.timestamp).toLocaleString()} • {item.resultCount} results
                          </Muted>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSearch(item.query);
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedSearches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Save className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-muted-foreground">No saved searches</P>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {savedSearches.map((saved) => (
                <Card key={saved.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <P className="font-semibold">{saved.name}</P>
                        <Muted className="text-sm">
                          Saved {new Date(saved.createdAt).toLocaleDateString()}
                        </Muted>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadSavedSearch(saved)}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSavedSearch(saved.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchPage;

