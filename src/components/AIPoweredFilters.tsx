import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Lightbulb, X, CheckCircle } from 'lucide-react';
import { P, Muted } from '@/components/ui/typography';
import { toast } from 'sonner';

interface AIPoweredFiltersProps {
  userPreferences?: {
    favoriteColors?: string[];
    preferredStyles?: string[];
    budgetRange?: string;
    occasionPreferences?: string[];
  };
  onApplyFilters: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
}

interface SmartFilter {
  id: string;
  label: string;
  value: any;
  confidence: number;
  reason: string;
}

const AIPoweredFilters: React.FC<AIPoweredFiltersProps> = ({
  userPreferences,
  onApplyFilters,
  onClearFilters,
}) => {
  const [smartFilters, setSmartFilters] = useState<SmartFilter[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateSmartFilters = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const filters: SmartFilter[] = [];
      
      if (userPreferences?.favoriteColors && userPreferences.favoriteColors.length > 0) {
        filters.push({
          id: 'color',
          label: `Colors: ${userPreferences.favoriteColors.slice(0, 3).join(', ')}`,
          value: userPreferences.favoriteColors.slice(0, 3),
          confidence: 0.85,
          reason: 'Based on your favorite colors',
        });
      }
      
      if (userPreferences?.preferredStyles && userPreferences.preferredStyles.length > 0) {
        filters.push({
          id: 'style',
          label: `Style: ${userPreferences.preferredStyles[0]}`,
          value: userPreferences.preferredStyles[0],
          confidence: 0.80,
          reason: 'Matches your preferred style',
        });
      }
      
      if (userPreferences?.budgetRange) {
        const budgetMap: Record<string, [number, number]> = {
          budget: [0, 200],
          mid: [200, 500],
          premium: [500, 1500],
          luxury: [1500, 10000],
        };
        const range = budgetMap[userPreferences.budgetRange];
        if (range) {
          filters.push({
            id: 'price',
            label: `Price: $${range[0]} - $${range[1]}`,
            value: range,
            confidence: 0.90,
            reason: 'Within your budget range',
          });
        }
      }
      
      if (userPreferences?.occasionPreferences && userPreferences.occasionPreferences.length > 0) {
        filters.push({
          id: 'occasion',
          label: `Occasion: ${userPreferences.occasionPreferences[0]}`,
          value: userPreferences.occasionPreferences[0],
          confidence: 0.75,
          reason: 'For your preferred occasions',
        });
      }
      
      // Add trending filter if no strong preferences
      if (filters.length === 0) {
        filters.push({
          id: 'trending',
          label: 'Trending Products',
          value: true,
          confidence: 0.70,
          reason: 'Popular items you might like',
        });
      }
      
      setSmartFilters(filters);
      setIsAnalyzing(false);
      toast.success('AI filters generated!');
    }, 1500);
  };

  const handleApplyFilters = () => {
    const filterObject: Record<string, any> = {};
    smartFilters.forEach(filter => {
      filterObject[filter.id] = filter.value;
    });
    onApplyFilters(filterObject);
    toast.success('AI filters applied!');
  };

  const handleRemoveFilter = (filterId: string) => {
    setSmartFilters(smartFilters.filter(f => f.id !== filterId));
  };

  const handleClearAll = () => {
    setSmartFilters([]);
    onClearFilters();
    toast.success('Filters cleared');
  };

  React.useEffect(() => {
    // Load user preferences from localStorage
    const prefs = localStorage.getItem('user_preferences');
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        if (parsed.style) {
          // Auto-generate filters on mount if preferences exist
          setTimeout(() => {
            generateSmartFilters();
          }, 500);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Smart Filters</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSmartFilters}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          Let AI suggest filters based on your preferences and behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {smartFilters.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-muted-foreground mb-2">No AI filters generated yet</P>
            <Muted className="text-sm">
              Click "Generate" to let AI create personalized filters for you
            </Muted>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {smartFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-start justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <P className="font-semibold text-sm">{filter.label}</P>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(filter.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <Muted className="text-xs flex items-center gap-1">
                      <Lightbulb className="h-3 w-3" />
                      {filter.reason}
                    </Muted>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveFilter(filter.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AIPoweredFilters;

