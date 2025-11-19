import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/data/dummyData";
import { toast } from "sonner";

interface WishlistItem extends Product {
  addedAt: string;
  listId: string;
}

export interface Wishlist {
  id: string;
  name: string;
  type: 'personal' | 'shared' | 'gift-registry';
  isDefault: boolean;
  shareToken?: string;
  createdAt: string;
  items: WishlistItem[];
}

interface EnhancedWishlistContextValue {
  wishlists: Wishlist[];
  activeWishlistId: string | null;
  setActiveWishlist: (wishlistId: string) => void;
  createWishlist: (name: string, type?: 'personal' | 'shared' | 'gift-registry') => string;
  deleteWishlist: (wishlistId: string) => void;
  renameWishlist: (wishlistId: string, newName: string) => void;
  addToWishlist: (product: Product, wishlistId?: string) => void;
  removeFromWishlist: (productId: string, wishlistId?: string) => void;
  isInWishlist: (productId: string, wishlistId?: string) => boolean;
  getWishlistItems: (wishlistId?: string) => WishlistItem[];
  shareWishlist: (wishlistId: string) => string;
  getWishlistByToken: (token: string) => Wishlist | null;
  clearWishlist: (wishlistId?: string) => void;
}

const EnhancedWishlistContext = createContext<EnhancedWishlistContextValue | undefined>(undefined);

const STORAGE_KEY = "silqcommerce_enhanced_wishlists";

export const EnhancedWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [activeWishlistId, setActiveWishlistId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setWishlists(parsed.wishlists || []);
        setActiveWishlistId(parsed.activeWishlistId || null);
      } else {
        // Create default wishlist
        const defaultWishlist: Wishlist = {
          id: 'default',
          name: 'My Wishlist',
          type: 'personal',
          isDefault: true,
          createdAt: new Date().toISOString(),
          items: [],
        };
        setWishlists([defaultWishlist]);
        setActiveWishlistId('default');
      }
    } catch {
      const defaultWishlist: Wishlist = {
        id: 'default',
        name: 'My Wishlist',
        type: 'personal',
        isDefault: true,
        createdAt: new Date().toISOString(),
        items: [],
      };
      setWishlists([defaultWishlist]);
      setActiveWishlistId('default');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ wishlists, activeWishlistId }));
  }, [wishlists, activeWishlistId]);

  const setActiveWishlist = (wishlistId: string) => {
    if (wishlists.some(w => w.id === wishlistId)) {
      setActiveWishlistId(wishlistId);
    }
  };

  const createWishlist = (name: string, type: 'personal' | 'shared' | 'gift-registry' = 'personal'): string => {
    const newWishlist: Wishlist = {
      id: `wishlist-${Date.now()}`,
      name,
      type,
      isDefault: false,
      createdAt: new Date().toISOString(),
      items: [],
    };
    setWishlists((prev) => [...prev, newWishlist]);
    setActiveWishlistId(newWishlist.id);
    toast.success(`Wishlist "${name}" created!`);
    return newWishlist.id;
  };

  const deleteWishlist = (wishlistId: string) => {
    const wishlist = wishlists.find(w => w.id === wishlistId);
    if (wishlist?.isDefault) {
      toast.error('Cannot delete default wishlist');
      return;
    }
    setWishlists((prev) => {
      const filtered = prev.filter((w) => w.id !== wishlistId);
      if (activeWishlistId === wishlistId && filtered.length > 0) {
        setActiveWishlistId(filtered[0].id);
      }
      return filtered;
    });
    toast.success('Wishlist deleted');
  };

  const renameWishlist = (wishlistId: string, newName: string) => {
    setWishlists((prev) =>
      prev.map((w) => (w.id === wishlistId ? { ...w, name: newName } : w))
    );
    toast.success('Wishlist renamed');
  };

  const addToWishlist = (product: Product, wishlistId?: string) => {
    const targetId = wishlistId || activeWishlistId || wishlists[0]?.id;
    if (!targetId) return;

    setWishlists((prev) =>
      prev.map((w) => {
        if (w.id === targetId) {
          if (w.items.some((item) => item.id === product.id)) {
            toast.info(`${product.name} is already in this wishlist.`);
            return w;
          }
          return {
            ...w,
            items: [...w.items, { ...product, addedAt: new Date().toISOString(), listId: w.id }],
          };
        }
        return w;
      })
    );
    toast.success(`${product.name} added to wishlist.`);
  };

  const removeFromWishlist = (productId: string, wishlistId?: string) => {
    const targetId = wishlistId || activeWishlistId || wishlists[0]?.id;
    if (!targetId) return;

    setWishlists((prev) =>
      prev.map((w) => {
        if (w.id === targetId) {
          const product = w.items.find((item) => item.id === productId);
          if (product) {
            toast.info(`${product.name} removed from wishlist.`);
          }
          return {
            ...w,
            items: w.items.filter((item) => item.id !== productId),
          };
        }
        return w;
      })
    );
  };

  const isInWishlist = (productId: string, wishlistId?: string): boolean => {
    const targetId = wishlistId || activeWishlistId || wishlists[0]?.id;
    const wishlist = wishlists.find((w) => w.id === targetId);
    return wishlist ? wishlist.items.some((item) => item.id === productId) : false;
  };

  const getWishlistItems = (wishlistId?: string): WishlistItem[] => {
    const targetId = wishlistId || activeWishlistId || wishlists[0]?.id;
    const wishlist = wishlists.find((w) => w.id === targetId);
    return wishlist?.items || [];
  };

  const shareWishlist = (wishlistId: string): string => {
    const token = `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setWishlists((prev) =>
      prev.map((w) => (w.id === wishlistId ? { ...w, shareToken: token } : w))
    );
    const shareUrl = `${window.location.origin}/wishlist/shared/${token}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
    return shareUrl;
  };

  const getWishlistByToken = (token: string): Wishlist | null => {
    return wishlists.find((w) => w.shareToken === token) || null;
  };

  const clearWishlist = (wishlistId?: string) => {
    const targetId = wishlistId || activeWishlistId || wishlists[0]?.id;
    if (!targetId) return;

    setWishlists((prev) =>
      prev.map((w) => (w.id === targetId ? { ...w, items: [] } : w))
    );
    toast.info('Wishlist cleared.');
  };

  const value = useMemo(
    () => ({
      wishlists,
      activeWishlistId,
      setActiveWishlist,
      createWishlist,
      deleteWishlist,
      renameWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistItems,
      shareWishlist,
      getWishlistByToken,
      clearWishlist,
    }),
    [wishlists, activeWishlistId]
  );

  return <EnhancedWishlistContext.Provider value={value}>{children}</EnhancedWishlistContext.Provider>;
};

export const useEnhancedWishlist = () => {
  const context = useContext(EnhancedWishlistContext);
  if (!context) {
    throw new Error("useEnhancedWishlist must be used within an EnhancedWishlistProvider");
  }
  return context;
};

