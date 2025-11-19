import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Ruler, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { P, Muted } from '@/components/ui/typography';
import { toast } from 'sonner';

interface SizePredictionProps {
  productId: string;
  productName: string;
  category: string;
  onSizeSelected?: (size: string) => void;
}

interface SizePrediction {
  recommendedSize: string;
  confidence: number;
  reason: string;
  alternativeSizes?: string[];
}

const SizePrediction: React.FC<SizePredictionProps> = ({
  productId,
  productName,
  category,
  onSizeSelected,
}) => {
  const [measurements, setMeasurements] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    shoeSize: '',
    previousSize: '',
    previousBrand: '',
  });
  const [prediction, setPrediction] = useState<SizePrediction | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const calculateSize = async () => {
    setIsCalculating(true);

    // Simulate AI/ML size prediction
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock size prediction algorithm
    const categorySizes: Record<string, string[]> = {
      'Clothing': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'Shoes': ['6', '7', '8', '9', '10', '11', '12'],
      'Watches': ['Small', 'Medium', 'Large'],
      'Handbags': ['Small', 'Medium', 'Large'],
    };

    const availableSizes = categorySizes[category] || ['S', 'M', 'L'];
    
    // Simple prediction logic (in production, this would use ML model)
    let recommendedSize = 'M';
    let confidence = 0.75;
    let reason = 'Based on standard sizing';

    if (measurements.height && measurements.weight) {
      const height = parseFloat(measurements.height);
      const weight = parseFloat(measurements.weight);
      
      // Simple BMI-based estimation
      if (height > 0 && weight > 0) {
        const bmi = weight / ((height / 100) ** 2);
        if (bmi < 18.5) recommendedSize = 'XS';
        else if (bmi < 25) recommendedSize = 'S';
        else if (bmi < 30) recommendedSize = 'M';
        else if (bmi < 35) recommendedSize = 'L';
        else recommendedSize = 'XL';
        
        confidence = 0.85;
        reason = 'Based on your height and weight measurements';
      }
    }

    if (measurements.previousSize && measurements.previousBrand) {
      confidence = 0.90;
      reason = `Based on your previous ${measurements.previousBrand} size (${measurements.previousSize})`;
      recommendedSize = measurements.previousSize;
    }

    const result: SizePrediction = {
      recommendedSize,
      confidence,
      reason,
      alternativeSizes: availableSizes.filter((s) => s !== recommendedSize).slice(0, 2),
    };

    setPrediction(result);
    setIsCalculating(false);
    toast.success('Size prediction calculated!');
  };

  const handleSelectSize = (size: string) => {
    if (onSizeSelected) {
      onSizeSelected(size);
    }
    toast.success(`Selected size: ${size}`);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          AI Size Prediction
        </CardTitle>
        <CardDescription>
          Get personalized size recommendations using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!prediction ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={measurements.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={measurements.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>
              {category === 'Clothing' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="chest">Chest (cm)</Label>
                    <Input
                      id="chest"
                      type="number"
                      placeholder="100"
                      value={measurements.chest}
                      onChange={(e) => handleInputChange('chest', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waist">Waist (cm)</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="80"
                      value={measurements.waist}
                      onChange={(e) => handleInputChange('waist', e.target.value)}
                    />
                  </div>
                </>
              )}
              {category === 'Shoes' && (
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="shoeSize">Current Shoe Size</Label>
                  <Input
                    id="shoeSize"
                    type="text"
                    placeholder="9"
                    value={measurements.shoeSize}
                    onChange={(e) => handleInputChange('shoeSize', e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-4">
              <P className="text-sm font-semibold">Previous Purchase (Optional)</P>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="previousSize">Previous Size</Label>
                  <Input
                    id="previousSize"
                    placeholder="M"
                    value={measurements.previousSize}
                    onChange={(e) => handleInputChange('previousSize', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previousBrand">Brand</Label>
                  <Input
                    id="previousBrand"
                    placeholder="Brand name"
                    value={measurements.previousBrand}
                    onChange={(e) => handleInputChange('previousBrand', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={calculateSize}
              disabled={isCalculating}
              className="w-full"
            >
              {isCalculating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Ruler className="h-4 w-4 mr-2" />
                  Predict My Size
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <P className="font-semibold text-lg">Recommended Size</P>
                  <P className="text-3xl font-bold text-primary mt-1">
                    {prediction.recommendedSize}
                  </P>
                </div>
                <Badge
                  variant="outline"
                  className={`${getConfidenceColor(prediction.confidence)} border-current`}
                >
                  {getConfidenceLabel(prediction.confidence)} Confidence
                </Badge>
              </div>
              <Muted className="text-sm">{prediction.reason}</Muted>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${prediction.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {Math.round(prediction.confidence * 100)}%
                </span>
              </div>
            </div>

            {prediction.alternativeSizes && prediction.alternativeSizes.length > 0 && (
              <div>
                <P className="text-sm font-semibold mb-2">Alternative Sizes</P>
                <div className="flex gap-2">
                  {prediction.alternativeSizes.map((size) => (
                    <Button
                      key={size}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => handleSelectSize(prediction.recommendedSize)}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Select {prediction.recommendedSize}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPrediction(null);
                  setMeasurements({
                    height: '',
                    weight: '',
                    chest: '',
                    waist: '',
                    hips: '',
                    shoeSize: '',
                    previousSize: '',
                    previousBrand: '',
                  });
                }}
              >
                Recalculate
              </Button>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <Muted className="text-xs">
                  Size predictions are estimates. Please refer to the size guide for accurate measurements.
                </Muted>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SizePrediction;

