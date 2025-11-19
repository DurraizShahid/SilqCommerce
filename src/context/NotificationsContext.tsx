import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'order' | 'product' | 'promotion' | 'system' | 'message' | 'review';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  icon?: string;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load notifications:', e);
      }
    } else {
      // Seed with some initial notifications
      const initial: Notification[] = [
        {
          id: 'n1',
          type: 'order',
          title: 'Order Confirmed',
          message: 'Your order #12345 has been confirmed and is being processed.',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          link: '/account/orders/12345',
        },
        {
          id: 'n2',
          type: 'product',
          title: 'Price Drop Alert',
          message: 'Luxury Handbag is now 20% off!',
          read: false,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          link: '/products/prod1',
        },
        {
          id: 'n3',
          type: 'promotion',
          title: 'New Collection',
          message: 'Check out our new luxury collection - exclusive early access!',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          link: '/products?new=true',
        },
      ];
      setNotifications(initial);
      localStorage.setItem('notifications', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    // Save notifications to localStorage whenever they change
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotification, ...prev].slice(0, 100)); // Keep last 100
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

