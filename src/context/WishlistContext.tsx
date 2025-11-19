import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/data/dummyData";
import { toast } from "sonner";

interface WishlistItem extends Product {
  addedAt: string;
}

interface WishlistContextValue {
  wishlistedItems: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const STORAGE_KEY = "silqcommerce_wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistedItems, setWishlistedItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWishlistedItems(JSON.parse(stored));
      }
    } catch {
      setWishlistedItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistedItems));
  }, [wishlistedItems]);

  const isInWishlist = (productId: string) => wishlistedItems.some((item) => item.id === productId);

  const addToWishlist = (product: Product) => {
    setWishlistedItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        toast.info(`${product.name} is already in your wishlist.`);
        return prev;
      }
      const updated = [...prev, { ...product, addedAt: new Date().toISOString() }];
      toast.success(`${product.name} saved to wishlist.`);
      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistedItems((prev) => {
      const product = prev.find((item) => item.id === productId);
      if (product) {
        toast.info(`${product.name} removed from wishlist.`);
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const clearWishlist = () => {
    setWishlistedItems([]);
    toast.info("Wishlist cleared.");
  };

  const value = useMemo(
    () => ({
      wishlistedItems,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
    }),
    [wishlistedItems]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

