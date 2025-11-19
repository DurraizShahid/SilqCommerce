import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Sparkles, Bell, X, Clock } from 'lucide-react';
import { products } from '@/data/dummyData';
import { P, Muted } from '@/components/ui/typography';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface NewArrival {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  price: number;
  addedAt: string;
  isNotified: boolean;
}

const NewArrivalsFeed: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    // Load new arrivals from localStorage or generate from products
    const saved = JSON.parse(localStorage.getItem('new_arrivals_feed') || '[]');
    
    if (saved.length === 0) {
      // Generate initial new arrivals from products marked as new
      const arrivals: NewArrival[] = products
        .filter((p) => p.isNew)
        .slice(0, 10)
        .map((p) => ({
          id: `arrival-${p.id}`,
          productId: p.id,
          productName: p.name,
          productImage: p.imageUrl,
          category: p.category,
          price: p.price,
          addedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 7 days
          isNotified: false,
        }));
      
      setNewArrivals(arrivals);
      localStorage.setItem('new_arrivals_feed', JSON.stringify(arrivals));
    } else {
      setNewArrivals(saved);
    }

    // Check for new products periodically (simulated)
    const interval = setInterval(() => {
      const newProducts = products.filter((p) => p.isNew && !saved.some((a: NewArrival) => a.productId === p.id));
      
      if (newProducts.length > 0) {
        const newArrival: NewArrival = {
          id: `arrival-${Date.now()}`,
          productId: newProducts[0].id,
          productName: newProducts[0].name,
          productImage: newProducts[0].imageUrl,
          category: newProducts[0].category,
          price: newProducts[0].price,
          addedAt: new Date().toISOString(),
          isNotified: false,
        };

        const updated = [newArrival, ...saved].slice(0, 20);
        setNewArrivals(updated);
        localStorage.setItem('new_arrivals_feed', JSON.stringify(updated));
        
        if (showNotifications) {
          toast.info(`New arrival: ${newArrival.productName}`, {
            action: {
              label: 'View',
              onClick: () => window.location.href = `/products/${newArrival.productId}`,
            },
          });
        }
      }
    }, 30000); // Check every 30 seconds (for demo purposes)

    return () => clearInterval(interval);
  }, [showNotifications]);

  const handleDismiss = (id: string) => {
    setNewArrivals((prev) => prev.filter((a) => a.id !== id));
    const updated = newArrivals.filter((a) => a.id !== id);
    localStorage.setItem('new_arrivals_feed', JSON.stringify(updated));
  };

  const handleMarkAsNotified = (id: string) => {
    setNewArrivals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isNotified: true } : a))
    );
    const updated = newArrivals.map((a) => (a.id === id ? { ...a, isNotified: true } : a));
    localStorage.setItem('new_arrivals_feed', JSON.stringify(updated));
  };

  const recentArrivals = newArrivals.slice(0, 5);

  if (recentArrivals.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            New Arrivals
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className={`h-4 w-4 ${showNotifications ? 'text-primary' : ''}`} />
            </Button>
            <Link to="/trending">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentArrivals.map((arrival) => (
          <div
            key={arrival.id}
            className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Link to={`/products/${arrival.productId}`} className="flex-1 flex items-center gap-3">
              <img
                src={arrival.productImage}
                alt={arrival.productName}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <P className="text-sm font-semibold truncate">{arrival.productName}</P>
                <div className="flex items-center gap-2 mt-1">
                  <Muted className="text-xs">{arrival.category}</Muted>
                  <span className="text-xs text-muted-foreground">•</span>
                  <Muted className="text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(arrival.addedAt), { addSuffix: true })}
                  </Muted>
                </div>
                <P className="text-sm font-semibold text-primary mt-1">
                  {formatPrice(arrival.price)}
                </P>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              {!arrival.isNotified && (
                <Badge variant="default" className="text-xs">
                  New
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDismiss(arrival.id)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewArrivalsFeed;

