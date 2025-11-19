import React, { useState } from 'react';
import { Product } from '@/data/dummyData';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, DollarSign } from 'lucide-react';
import { useProductAlerts } from '@/context/ProductAlertsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductAlertButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ProductAlertButton: React.FC<ProductAlertButtonProps> = ({ 
  product, 
  variant = 'outline',
  size = 'default'
}) => {
  const { addBackInStockAlert, addPriceDropAlert, hasAlert, removeAlert } = useProductAlerts();
  const { formatPrice } = useCurrency();
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState<string>('');

  const hasBackInStockAlert = hasAlert(product.id, 'back-in-stock');
  const hasPriceDropAlert = hasAlert(product.id, 'price-drop');

  const handleBackInStockToggle = () => {
    if (hasBackInStockAlert) {
      // Find and remove the alert
      const alerts = JSON.parse(localStorage.getItem('silqcommerce_product_alerts') || '[]');
      const alert = alerts.find((a: any) => a.productId === product.id && a.type === 'back-in-stock');
      if (alert) {
        removeAlert(alert.id);
      }
    } else {
      addBackInStockAlert(product);
    }
  };

  const handlePriceDropClick = () => {
    if (hasPriceDropAlert) {
      const alerts = JSON.parse(localStorage.getItem('silqcommerce_product_alerts') || '[]');
      const alert = alerts.find((a: any) => a.productId === product.id && a.type === 'price-drop');
      if (alert) {
        removeAlert(alert.id);
      }
    } else {
      setIsPriceDialogOpen(true);
    }
  };

  const handleSetPriceAlert = () => {
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      return;
    }
    addPriceDropAlert(product, price);
    setIsPriceDialogOpen(false);
    setTargetPrice('');
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {product.stock === 0 && (
          <Button
            variant={hasBackInStockAlert ? 'default' : variant}
            size={size}
            onClick={handleBackInStockToggle}
            className="w-full"
          >
            {hasBackInStockAlert ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Remove Back-in-Stock Alert
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Alert When Back in Stock
              </>
            )}
          </Button>
        )}
        <Button
          variant={hasPriceDropAlert ? 'default' : variant}
          size={size}
          onClick={handlePriceDropClick}
          className="w-full"
        >
          {hasPriceDropAlert ? (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Remove Price Alert
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-2" />
              Alert on Price Drop
            </>
          )}
        </Button>
      </div>

      <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Price Drop Alert</DialogTitle>
            <DialogDescription>
              Get notified when {product.name} drops to your target price.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="targetPrice">Target Price</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current: {formatPrice(product.price)}</span>
              </div>
              <Input
                id="targetPrice"
                type="number"
                step="0.01"
                min="0"
                max={product.price}
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder={`Enter price below ${formatPrice(product.price)}`}
              />
              <p className="text-xs text-muted-foreground">
                We'll notify you when the price drops to or below this amount.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPriceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetPriceAlert} disabled={!targetPrice || parseFloat(targetPrice) >= product.price}>
              Set Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductAlertButton;

