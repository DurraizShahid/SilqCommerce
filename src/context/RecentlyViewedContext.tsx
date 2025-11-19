import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product } from '@/data/dummyData';

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  maxItems: number;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const STORAGE_KEY = "silqcommerce_recently_viewed";
const MAX_ITEMS = 20;

export const RecentlyViewedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to beginning and limit to MAX_ITEMS
      return [product, ...filtered].slice(0, MAX_ITEMS);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  const value = useMemo(
    () => ({
      recentlyViewed,
      addToRecentlyViewed,
      clearRecentlyViewed,
      maxItems: MAX_ITEMS,
    }),
    [recentlyViewed]
  );

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
};

