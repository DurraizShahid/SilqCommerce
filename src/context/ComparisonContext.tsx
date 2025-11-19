import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Product } from '@/data/dummyData';
import { toast } from 'sonner';

interface ComparisonContextType {
  comparisonProducts: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_ITEMS = 4;

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);

  const isInComparison = (productId: string) => 
    comparisonProducts.some((p) => p.id === productId);

  const canAddMore = comparisonProducts.length < MAX_COMPARISON_ITEMS;

  const addToComparison = (product: Product) => {
    if (isInComparison(product.id)) {
      toast.info(`${product.name} is already in comparison.`);
      return;
    }
    if (comparisonProducts.length >= MAX_COMPARISON_ITEMS) {
      toast.error(`You can compare up to ${MAX_COMPARISON_ITEMS} products at once.`);
      return;
    }
    setComparisonProducts((prev) => {
      const updated = [...prev, product];
      toast.success(`${product.name} added to comparison.`);
      return updated;
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProducts((prev) => {
      const product = prev.find((p) => p.id === productId);
      if (product) {
        toast.info(`${product.name} removed from comparison.`);
      }
      return prev.filter((p) => p.id !== productId);
    });
  };

  const clearComparison = () => {
    setComparisonProducts([]);
    toast.info('Comparison cleared.');
  };

  const value = useMemo(
    () => ({
      comparisonProducts,
      addToComparison,
      removeFromComparison,
      clearComparison,
      isInComparison,
      canAddMore,
    }),
    [comparisonProducts]
  );

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

