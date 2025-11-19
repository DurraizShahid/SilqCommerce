import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { P, Muted } from '@/components/ui/typography';
import { toast } from 'sonner';

interface NaturalLanguageSearchProps {
  onSearch: (query: string, filters: Record<string, any>) => void;
  placeholder?: string;
}

interface ParsedQuery {
  keywords: string[];
  filters: {
    category?: string;
    priceRange?: [number, number];
    color?: string;
    size?: string;
    brand?: string;
    occasion?: string;
    style?: string;
  };
  intent: 'browse' | 'specific' | 'compare' | 'discover';
}

const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({
  onSearch,
  placeholder = "Try: 'red dress under $200 for party' or 'luxury handbags'",
}) => {
  const [query, setQuery] = useState('');
  const [parsedQuery, setParsedQuery] = useState<ParsedQuery | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const exampleQueries = [
    "red dress under $200 for party",
    "luxury handbags from Gucci",
    "black leather jacket size medium",
    "summer dresses in blue or white",
    "designer shoes for wedding",
    "casual outfits under $150",
    "winter coats for women",
    "gold jewelry for special occasion",
  ];

  const parseNaturalLanguage = (text: string): ParsedQuery => {
    const lowerText = text.toLowerCase();
    const filters: ParsedQuery['filters'] = {};
    const keywords: string[] = [];
    
    // Extract price range
    const priceMatch = lowerText.match(/(?:under|below|less than|max|maximum)\s*\$?(\d+)/);
    if (priceMatch) {
      filters.priceRange = [0, parseInt(priceMatch[1])];
    }
    const priceRangeMatch = lowerText.match(/\$?(\d+)\s*(?:to|-|and)\s*\$?(\d+)/);
    if (priceRangeMatch) {
      filters.priceRange = [parseInt(priceRangeMatch[1]), parseInt(priceRangeMatch[2])];
    }

    // Extract colors
    const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'grey', 'brown', 'pink', 'purple', 'orange', 'gold', 'silver', 'navy', 'beige'];
    const foundColor = colors.find(color => lowerText.includes(color));
    if (foundColor) {
      filters.color = foundColor;
    }

    // Extract sizes
    const sizes = ['xs', 'small', 's', 'medium', 'm', 'large', 'l', 'xl', 'xxl'];
    const foundSize = sizes.find(size => lowerText.includes(`size ${size}`) || lowerText.includes(`${size} size`));
    if (foundSize) {
      filters.size = foundSize === 'small' ? 's' : foundSize === 'medium' ? 'm' : foundSize === 'large' ? 'l' : foundSize;
    }

    // Extract categories
    const categories = ['dress', 'dresses', 'handbag', 'handbags', 'jacket', 'jackets', 'shoes', 'jewelry', 'watch', 'watches', 'coat', 'coats', 'outfit', 'outfits'];
    const foundCategory = categories.find(cat => lowerText.includes(cat));
    if (foundCategory) {
      filters.category = foundCategory.replace(/s$/, ''); // Remove plural
    }

    // Extract occasions
    const occasions = ['party', 'wedding', 'work', 'casual', 'formal', 'beach', 'travel', 'sport'];
    const foundOccasion = occasions.find(occ => lowerText.includes(occ));
    if (foundOccasion) {
      filters.occasion = foundOccasion;
    }

    // Extract styles
    const styles = ['luxury', 'designer', 'vintage', 'modern', 'classic', 'trendy', 'minimalist'];
    const foundStyle = styles.find(style => lowerText.includes(style));
    if (foundStyle) {
      filters.style = foundStyle;
    }

    // Extract brand names (common luxury brands)
    const brands = ['gucci', 'prada', 'versace', 'chanel', 'dior', 'louis vuitton', 'hermes', 'burberry'];
    const foundBrand = brands.find(brand => lowerText.includes(brand));
    if (foundBrand) {
      filters.brand = foundBrand;
    }

    // Extract keywords (remove filter words)
    const filterWords = [
      'under', 'below', 'less than', 'max', 'maximum', 'for', 'in', 'from', 'size',
      ...colors, ...sizes, ...categories, ...occasions, ...styles, ...brands,
      'dollar', 'dollars', '$', 'red', 'blue', 'green', 'yellow', 'black', 'white',
    ];
    const words = text.split(/\s+/).filter(word => {
      const lowerWord = word.toLowerCase().replace(/[^a-z]/g, '');
      return !filterWords.some(fw => lowerWord.includes(fw) || fw.includes(lowerWord));
    });
    keywords.push(...words.filter(w => w.length > 2));

    // Determine intent
    let intent: ParsedQuery['intent'] = 'browse';
    if (lowerText.includes('compare') || lowerText.includes('vs') || lowerText.includes('versus')) {
      intent = 'compare';
    } else if (lowerText.includes('find') || lowerText.includes('show me') || lowerText.includes('looking for')) {
      intent = 'specific';
    } else if (lowerText.includes('discover') || lowerText.includes('explore') || lowerText.includes('browse')) {
      intent = 'discover';
    }

    return { keywords, filters, intent };
  };

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    const parsed = parseNaturalLanguage(query);
    setParsedQuery(parsed);
    onSearch(query, parsed.filters);
    setShowSuggestions(false);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowSuggestions(false);
    setTimeout(() => {
      const parsed = parseNaturalLanguage(example);
      setParsedQuery(parsed);
      onSearch(example, parsed.filters);
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary z-10" />
            <Input
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="pl-10"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => {
                  setQuery('');
                  setParsedQuery(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Suggestions */}
        {showSuggestions && query.length === 0 && (
          <Card className="absolute top-full mt-2 w-full z-50">
            <CardContent className="pt-4">
              <P className="text-sm font-semibold mb-2">Try these examples:</P>
              <div className="space-y-2">
                {exampleQueries.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(example)}
                    className="w-full text-left text-sm text-muted-foreground hover:text-foreground p-2 rounded hover:bg-muted transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Parsed Query Display */}
      {parsedQuery && (
        <Card className="border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <P className="text-sm font-semibold">AI Understanding:</P>
            </div>
            <div className="space-y-2">
              {parsedQuery.keywords.length > 0 && (
                <div>
                  <Muted className="text-xs">Keywords:</Muted>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {parsedQuery.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {Object.keys(parsedQuery.filters).length > 0 && (
                <div>
                  <Muted className="text-xs">Filters Applied:</Muted>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {parsedQuery.filters.category && (
                      <Badge variant="secondary" className="text-xs">Category: {parsedQuery.filters.category}</Badge>
                    )}
                    {parsedQuery.filters.color && (
                      <Badge variant="secondary" className="text-xs">Color: {parsedQuery.filters.color}</Badge>
                    )}
                    {parsedQuery.filters.size && (
                      <Badge variant="secondary" className="text-xs">Size: {parsedQuery.filters.size}</Badge>
                    )}
                    {parsedQuery.filters.priceRange && (
                      <Badge variant="secondary" className="text-xs">
                        Price: ${parsedQuery.filters.priceRange[0]} - ${parsedQuery.filters.priceRange[1]}
                      </Badge>
                    )}
                    {parsedQuery.filters.brand && (
                      <Badge variant="secondary" className="text-xs">Brand: {parsedQuery.filters.brand}</Badge>
                    )}
                    {parsedQuery.filters.occasion && (
                      <Badge variant="secondary" className="text-xs">Occasion: {parsedQuery.filters.occasion}</Badge>
                    )}
                    {parsedQuery.filters.style && (
                      <Badge variant="secondary" className="text-xs">Style: {parsedQuery.filters.style}</Badge>
                    )}
                  </div>
                </div>
              )}
              <div>
                <Muted className="text-xs">Intent:</Muted>
                <Badge variant="outline" className="text-xs ml-1 capitalize">{parsedQuery.intent}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NaturalLanguageSearch;

