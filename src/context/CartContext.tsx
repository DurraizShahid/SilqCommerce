import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/data/dummyData';
import { toast } from 'sonner';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        if (newQuantity > product.stock) {
          toast.error(`Cannot add more than available stock (${product.stock}) for ${product.name}.`);
          return prevItems;
        }
        toast.success(`${quantityToAdd} x ${product.name} added to cart.`);
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        if (quantityToAdd > product.stock) {
          toast.error(`Cannot add more than available stock (${product.stock}) for ${product.name}.`);
          return prevItems;
        }
        toast.success(`${quantityToAdd} x ${product.name} added to cart.`);
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`${removedItem.name} removed from cart.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === productId) {
          if (newQuantity <= 0) {
            toast.info(`${item.name} removed from cart.`);
            return null; // Mark for removal
          }
          if (newQuantity > item.stock) {
            toast.error(`Cannot add more than available stock (${item.stock}) for ${item.name}.`);
            return item; // Don't update if exceeding stock
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]; // Filter out nulls
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared.");
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};