import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, 
  Calculator, 
  TrendingDown, 
  Info,
  ShoppingBag,
  Truck,
  Package,
  Factory,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';

interface CarbonFootprint {
  total: number; // kg CO2
  breakdown: {
    production: number;
    materials: number;
    shipping: number;
    packaging: number;
  };
}

const CarbonFootprintPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { items } = useCart();
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'green'>('standard');
  const [packagingType, setPackagingType] = useState<'standard' | 'eco-friendly'>('standard');
  const [includeOffset, setIncludeOffset] = useState(false);

  // Calculate carbon footprint for cart items
  const carbonFootprint = useMemo<CarbonFootprint>(() => {
    // Mock calculation - in real app, this would use actual product data
    const baseFootprint = items.reduce((total, item) => {
      // Average carbon footprint per product category (kg CO2)
      const categoryFootprints: Record<string, number> = {
        'Dresses': 15.5,
        'Outerwear': 22.3,
        'Accessories': 8.7,
        'Footwear': 18.9,
        'Bags': 12.4,
      };
      const productFootprint = categoryFootprints[item.category] || 10;
      return total + productFootprint * item.quantity;
    }, 0);

    // Shipping footprint (kg CO2)
    const shippingFootprints = {
      standard: 2.5,
      express: 5.0,
      green: 0.5, // Carbon-neutral shipping
    };

    // Packaging footprint (kg CO2)
    const packagingFootprints = {
      standard: 1.2,
      'eco-friendly': 0.3,
    };

    return {
      total: baseFootprint + shippingFootprints[shippingMethod] + packagingFootprints[packagingType],
      breakdown: {
        production: baseFootprint * 0.6,
        materials: baseFootprint * 0.3,
        shipping: shippingFootprints[shippingMethod],
        packaging: packagingFootprints[packagingType],
      },
    };
  }, [items, shippingMethod, packagingType]);

  const offsetCost = useMemo(() => {
    // Average cost: $10 per ton CO2 = $0.01 per kg
    return carbonFootprint.total * 0.01;
  }, [carbonFootprint.total]);

  const handleCalculateOffset = () => {
    if (includeOffset) {
      toast.success(`Carbon offset added: ${carbonFootprint.total.toFixed(2)} kg CO2`);
    }
  };

  const getComparison = () => {
    // Average person's daily carbon footprint: ~16 kg CO2
    const dailyAverage = 16;
    const comparison = (carbonFootprint.total / dailyAverage) * 100;
    return comparison;
  };

  return (
    <div className="space-y-8">
      <div>
        <H1 className="flex items-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          Carbon Footprint Calculator
        </H1>
        <P className="text-muted-foreground">
          Calculate and offset the carbon footprint of your order
        </P>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Calculator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Order Footprint */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Your Order's Carbon Footprint
              </CardTitle>
              <CardDescription>
                Based on {items.length} item{items.length !== 1 ? 's' : ''} in your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-muted rounded-lg">
                <P className="text-sm text-muted-foreground mb-2">Total Carbon Footprint</P>
                <P className="text-4xl font-bold text-green-600">
                  {carbonFootprint.total.toFixed(2)} kg CO₂
                </P>
                <Muted className="text-xs mt-2">
                  Equivalent to {getComparison().toFixed(1)}% of average daily footprint
                </Muted>
              </div>

              {/* Breakdown */}
              <div className="space-y-3">
                <P className="font-semibold">Breakdown</P>
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4 text-muted-foreground" />
                        <Muted className="text-sm">Production & Materials</Muted>
                      </div>
                      <Muted className="text-sm">
                        {(carbonFootprint.breakdown.production + carbonFootprint.breakdown.materials).toFixed(2)} kg
                      </Muted>
                    </div>
                    <Progress
                      value={
                        ((carbonFootprint.breakdown.production + carbonFootprint.breakdown.materials) /
                          carbonFootprint.total) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <Muted className="text-sm">Shipping</Muted>
                      </div>
                      <Muted className="text-sm">{carbonFootprint.breakdown.shipping.toFixed(2)} kg</Muted>
                    </div>
                    <Progress
                      value={(carbonFootprint.breakdown.shipping / carbonFootprint.total) * 100}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <Muted className="text-sm">Packaging</Muted>
                      </div>
                      <Muted className="text-sm">{carbonFootprint.breakdown.packaging.toFixed(2)} kg</Muted>
                    </div>
                    <Progress
                      value={(carbonFootprint.breakdown.packaging / carbonFootprint.total) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Reduce Your Footprint</CardTitle>
              <CardDescription>Choose sustainable options to lower your impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping Method</Label>
                <Select value={shippingMethod} onValueChange={(value: any) => setShippingMethod(value)}>
                  <SelectTrigger id="shipping">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Shipping (2.5 kg CO₂)</SelectItem>
                    <SelectItem value="express">Express Shipping (5.0 kg CO₂)</SelectItem>
                    <SelectItem value="green">Green Shipping (0.5 kg CO₂)</SelectItem>
                  </SelectContent>
                </Select>
                {shippingMethod === 'green' && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                    <Leaf className="h-3 w-3 mr-1" />
                    Carbon-neutral shipping
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="packaging">Packaging Type</Label>
                <Select value={packagingType} onValueChange={(value: any) => setPackagingType(value)}>
                  <SelectTrigger id="packaging">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Packaging (1.2 kg CO₂)</SelectItem>
                    <SelectItem value="eco-friendly">Eco-Friendly Packaging (0.3 kg CO₂)</SelectItem>
                  </SelectContent>
                </Select>
                {packagingType === 'eco-friendly' && (
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                    <Leaf className="h-3 w-3 mr-1" />
                    Recyclable materials
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Offset Options */}
        <div className="space-y-6">
          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Carbon Offset
              </CardTitle>
              <CardDescription>
                Offset your order's carbon footprint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <P className="text-sm font-medium">Offset Amount</P>
                  <P className="text-lg font-bold text-green-600">
                    {carbonFootprint.total.toFixed(2)} kg CO₂
                  </P>
                </div>
                <div className="flex items-center justify-between">
                  <P className="text-sm text-muted-foreground">Cost</P>
                  <P className="text-xl font-bold">{formatPrice(offsetCost)}</P>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <input
                    type="checkbox"
                    id="includeOffset"
                    checked={includeOffset}
                    onChange={(e) => setIncludeOffset(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="includeOffset" className="flex-1 cursor-pointer">
                    <P className="text-sm font-medium">Include carbon offset</P>
                    <Muted className="text-xs">
                      Support verified carbon reduction projects
                    </Muted>
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleCalculateOffset}
                className="w-full"
                disabled={!includeOffset}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Add to Order
              </Button>

              <div className="pt-4 border-t">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5" />
                  <div>
                    <P className="font-medium mb-1">How it works:</P>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Funds support verified carbon reduction projects</li>
                      <li>Projects include reforestation and renewable energy</li>
                      <li>Certified by leading carbon offset standards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-4 bg-muted rounded-lg">
                <P className="text-2xl font-bold text-green-600">
                  {carbonFootprint.total.toFixed(2)} kg
                </P>
                <Muted className="text-xs">CO₂ equivalent</Muted>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <Muted>vs. Daily Average</Muted>
                  <P className="font-medium">{getComparison().toFixed(1)}%</P>
                </div>
                <div className="flex justify-between">
                  <Muted>With Green Shipping</Muted>
                  <P className="font-medium text-green-600">
                    -{(carbonFootprint.breakdown.shipping - 0.5).toFixed(2)} kg
                  </P>
                </div>
                <div className="flex justify-between">
                  <Muted>With Eco Packaging</Muted>
                  <P className="font-medium text-green-600">
                    -{(carbonFootprint.breakdown.packaging - 0.3).toFixed(2)} kg
                  </P>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintPage;

