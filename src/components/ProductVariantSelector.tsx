import React, { useState } from 'react';
import { Product, ProductVariation } from '@/data/dummyData';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { P } from '@/components/ui/typography';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductVariantSelectorProps {
  product: Product;
  onVariantChange?: (selectedVariants: Record<string, string>) => void;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({ product, onVariantChange }) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const { formatPrice } = useCurrency();

  if (!product.variations || product.variations.length === 0) {
    return null;
  }

  const handleVariantSelect = (variationType: string, variantId: string) => {
    const newSelection = { ...selectedVariants, [variationType]: variantId };
    setSelectedVariants(newSelection);
    if (onVariantChange) {
      onVariantChange(newSelection);
    }
  };

  const getSelectedVariantPrice = () => {
    let totalModifier = 0;
    product.variations?.forEach((variation) => {
      const selectedVariantId = selectedVariants[variation.type];
      if (selectedVariantId) {
        const variant = variation.options.find((opt) => opt.id === selectedVariantId);
        if (variant?.priceModifier) {
          totalModifier += variant.priceModifier;
        }
      }
    });
    return product.price + totalModifier;
  };

  const getSelectedVariantStock = () => {
    if (product.variations && product.variations.length > 0) {
      // If variants are selected, return the stock of the selected variant
      // Otherwise return base product stock
      const firstVariation = product.variations[0];
      const selectedVariantId = selectedVariants[firstVariation.type];
      if (selectedVariantId) {
        const variant = firstVariation.options.find((opt) => opt.id === selectedVariantId);
        return variant?.stock ?? product.stock;
      }
    }
    return product.stock;
  };

  const finalPrice = getSelectedVariantPrice();
  const finalStock = getSelectedVariantStock();

  return (
    <div className="space-y-6">
      {product.variations.map((variation) => (
        <div key={variation.type} className="space-y-3">
          <Label className="text-base font-semibold capitalize">
            {variation.name || variation.type}:
            {selectedVariants[variation.type] && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {variation.options.find((opt) => opt.id === selectedVariants[variation.type])?.name}
              </span>
            )}
          </Label>
          <div className="flex flex-wrap gap-2">
            {variation.options.map((option) => {
              const isSelected = selectedVariants[variation.type] === option.id;
              const isOutOfStock = option.stock === 0;
              
              return (
                <Button
                  key={option.id}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVariantSelect(variation.type, option.id)}
                  disabled={isOutOfStock}
                  className={`min-w-[80px] ${
                    isSelected ? "ring-2 ring-accent-gold" : ""
                  } ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {option.name}
                  {option.priceModifier && option.priceModifier !== 0 && (
                    <span className="ml-1 text-xs">
                      ({option.priceModifier > 0 ? "+" : ""}{formatPrice(option.priceModifier)})
                    </span>
                  )}
                  {isOutOfStock && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Out
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
          {variation.options.some((opt) => opt.stock > 0 && opt.stock < 10) && (
            <P className="text-xs text-muted-foreground">
              Some options have limited stock
            </P>
          )}
        </div>
      ))}
      
      {(finalPrice !== product.price || finalStock !== product.stock) && (
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between items-center">
            <P className="font-semibold">Selected Price:</P>
            <P className="text-xl font-bold text-accent-gold">{formatPrice(finalPrice)}</P>
          </div>
          <div className="flex justify-between items-center">
            <P className="font-semibold">Stock:</P>
            <Badge variant={finalStock > 0 ? "default" : "destructive"}>
              {finalStock > 0 ? `${finalStock} available` : "Out of Stock"}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;

