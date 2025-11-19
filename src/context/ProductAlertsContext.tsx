import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product } from '@/data/dummyData';
import { toast } from 'sonner';

export type AlertType = 'back-in-stock' | 'price-drop';

interface ProductAlert {
  id: string;
  productId: string;
  productName: string;
  type: AlertType;
  targetPrice?: number; // For price drop alerts
  createdAt: string;
  notified?: boolean;
}

interface ProductAlertsContextType {
  alerts: ProductAlert[];
  addBackInStockAlert: (product: Product) => void;
  addPriceDropAlert: (product: Product, targetPrice: number) => void;
  removeAlert: (alertId: string) => void;
  hasAlert: (productId: string, type: AlertType) => boolean;
  clearAlerts: () => void;
}

const ProductAlertsContext = createContext<ProductAlertsContextType | undefined>(undefined);

const STORAGE_KEY = "silqcommerce_product_alerts";

export const ProductAlertsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<ProductAlert[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAlerts(JSON.parse(stored));
      }
    } catch {
      setAlerts([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  const addBackInStockAlert = (product: Product) => {
    if (product.stock > 0) {
      toast.info('This product is already in stock!');
      return;
    }

    const existingAlert = alerts.find(
      (a) => a.productId === product.id && a.type === 'back-in-stock'
    );

    if (existingAlert) {
      toast.info('You already have an alert set for this product.');
      return;
    }

    const newAlert: ProductAlert = {
      id: `alert-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      type: 'back-in-stock',
      createdAt: new Date().toISOString(),
      notified: false,
    };

    setAlerts((prev) => [...prev, newAlert]);
    toast.success(`Alert set! We'll notify you when ${product.name} is back in stock.`);
  };

  const addPriceDropAlert = (product: Product, targetPrice: number) => {
    if (targetPrice >= product.price) {
      toast.error('Target price must be lower than current price.');
      return;
    }

    const existingAlert = alerts.find(
      (a) => a.productId === product.id && a.type === 'price-drop'
    );

    if (existingAlert) {
      // Update existing alert
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === existingAlert.id
            ? { ...a, targetPrice }
            : a
        )
      );
      toast.success(`Price alert updated! We'll notify you when ${product.name} drops to ${targetPrice}.`);
    } else {
      const newAlert: ProductAlert = {
        id: `alert-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        type: 'price-drop',
        targetPrice,
        createdAt: new Date().toISOString(),
        notified: false,
      };

      setAlerts((prev) => [...prev, newAlert]);
      toast.success(`Price alert set! We'll notify you when ${product.name} drops to ${targetPrice}.`);
    }
  };

  const removeAlert = (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    if (alert) {
      toast.info(`Alert for ${alert.productName} removed.`);
    }
  };

  const hasAlert = (productId: string, type: AlertType) => {
    return alerts.some((a) => a.productId === productId && a.type === type);
  };

  const clearAlerts = () => {
    setAlerts([]);
    toast.info('All alerts cleared.');
  };

  const value = useMemo(
    () => ({
      alerts,
      addBackInStockAlert,
      addPriceDropAlert,
      removeAlert,
      hasAlert,
      clearAlerts,
    }),
    [alerts]
  );

  return <ProductAlertsContext.Provider value={value}>{children}</ProductAlertsContext.Provider>;
};

export const useProductAlerts = () => {
  const context = useContext(ProductAlertsContext);
  if (context === undefined) {
    throw new Error('useProductAlerts must be used within a ProductAlertsProvider');
  }
  return context;
};

