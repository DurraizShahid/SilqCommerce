import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { P } from '@/components/ui/typography';
import { X, Filter, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurrency } from '@/context/CurrencyContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface AdvancedSearchFiltersProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  inStockOnly: boolean;
  onInStockOnlyChange: (value: boolean) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  selectedVendors: string[];
  onVendorsChange: (vendors: string[]) => void;
  ratingFilter: number | null;
  onRatingFilterChange: (rating: number | null) => void;
  onSaveSearch?: () => void;
}

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  priceRange,
  onPriceRangeChange,
  maxPrice,
  inStockOnly,
  onInStockOnlyChange,
  selectedCategories,
  onCategoriesChange,
  selectedVendors,
  onVendorsChange,
  ratingFilter,
  onRatingFilterChange,
  onSaveSearch,
}) => {
  const { formatPrice } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const categories = ['Dresses', 'Outerwear', 'Accessories', 'Footwear', 'Bags'];
  const vendors = ['Luxury Fashion House', 'Elegant Essentials'];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const toggleVendor = (vendor: string) => {
    if (selectedVendors.includes(vendor)) {
      onVendorsChange(selectedVendors.filter((v) => v !== vendor));
    } else {
      onVendorsChange([...selectedVendors, vendor]);
    }
  };

  const clearAllFilters = () => {
    onPriceRangeChange([0, maxPrice]);
    onInStockOnlyChange(false);
    onCategoriesChange([]);
    onVendorsChange([]);
    onRatingFilterChange(null);
  };

  const activeFiltersCount =
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    selectedCategories.length +
    selectedVendors.length +
    (ratingFilter !== null ? 1 : 0);

  return (
    <Card className="border-dashed">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle>Advanced Filters</CardTitle>
                {activeFiltersCount > 0 && (
                  <Badge variant="default">{activeFiltersCount}</Badge>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Price Range</Label>
                <P className="text-sm font-semibold">
                  {formatPrice(priceRange[0])} – {formatPrice(priceRange[1])}
                </P>
              </div>
              <Slider
                min={0}
                max={maxPrice}
                step={10}
                value={priceRange}
                onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
                className="w-full"
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    onPriceRangeChange([parseFloat(e.target.value) || 0, priceRange[1]])
                  }
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    onPriceRangeChange([priceRange[0], parseFloat(e.target.value) || maxPrice])
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center justify-between">
              <div>
                <Label>In Stock Only</Label>
                <P className="text-xs text-muted-foreground">Hide out-of-stock items</P>
              </div>
              <Switch checked={inStockOnly} onCheckedChange={onInStockOnlyChange} />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    {selectedCategories.includes(category) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Vendors */}
            <div className="space-y-2">
              <Label>Vendors</Label>
              <div className="space-y-2">
                {vendors.map((vendor) => (
                  <div key={vendor} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vendor-${vendor}`}
                      checked={selectedVendors.includes(vendor)}
                      onCheckedChange={() => toggleVendor(vendor)}
                    />
                    <Label
                      htmlFor={`vendor-${vendor}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {vendor}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <Label>Minimum Rating</Label>
              <Select
                value={ratingFilter?.toString() || ''}
                onValueChange={(value) =>
                  onRatingFilterChange(value ? parseFloat(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                  <SelectItem value="1">1+ Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={clearAllFilters} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              {onSaveSearch && (
                <Button variant="outline" onClick={onSaveSearch} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Search
                </Button>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AdvancedSearchFilters;

