import React, { useState } from 'react';
import { Product } from '@/data/dummyData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  BellOff,
  DollarSign,
  Package,
  Mail,
  Smartphone,
  Settings,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import { P, Muted } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';

interface EnhancedProductAlertsProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

interface AlertPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

const EnhancedProductAlerts: React.FC<EnhancedProductAlertsProps> = ({
  product,
  variant = 'outline',
  size = 'default',
}) => {
  const { addBackInStockAlert, addPriceDropAlert, hasAlert, removeAlert } = useProductAlerts();
  const { formatPrice } = useCurrency();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertType, setAlertType] = useState<'back-in-stock' | 'price-drop' | null>(null);
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [preferences, setPreferences] = useState<AlertPreferences>({
    email: true,
    sms: false,
    push: true,
    frequency: 'immediate',
  });

  const hasBackInStockAlert = hasAlert(product.id, 'back-in-stock');
  const hasPriceDropAlert = hasAlert(product.id, 'price-drop');

  const handleBackInStockClick = () => {
    if (hasBackInStockAlert) {
      const alerts = JSON.parse(localStorage.getItem('silqcommerce_product_alerts') || '[]');
      const alert = alerts.find((a: any) => a.productId === product.id && a.type === 'back-in-stock');
      if (alert) {
        removeAlert(alert.id);
        toast.success('Back-in-stock alert removed');
      }
    } else {
      setAlertType('back-in-stock');
      setIsDialogOpen(true);
    }
  };

  const handlePriceDropClick = () => {
    if (hasPriceDropAlert) {
      const alerts = JSON.parse(localStorage.getItem('silqcommerce_product_alerts') || '[]');
      const alert = alerts.find((a: any) => a.productId === product.id && a.type === 'price-drop');
      if (alert) {
        removeAlert(alert.id);
        toast.success('Price drop alert removed');
      }
    } else {
      setAlertType('price-drop');
      setIsDialogOpen(true);
    }
  };

  const handleSaveAlert = () => {
    if (alertType === 'back-in-stock') {
      addBackInStockAlert(product);
      toast.success('Back-in-stock alert created with your preferences!');
    } else if (alertType === 'price-drop') {
      const price = parseFloat(targetPrice);
      if (isNaN(price) || price <= 0 || price >= product.price) {
        toast.error('Please enter a valid target price below the current price');
        return;
      }
      addPriceDropAlert(product, price);
      toast.success('Price drop alert created with your preferences!');
    }

    // Save preferences
    const alertPreferences = {
      productId: product.id,
      alertType,
      preferences,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('silqcommerce_alert_preferences') || '[]');
      const updated = existing.filter((p: any) => p.productId !== product.id);
      updated.push(alertPreferences);
      localStorage.setItem('silqcommerce_alert_preferences', JSON.stringify(updated));
    } catch {
      // Handle error
    }

    setIsDialogOpen(false);
    setTargetPrice('');
    setAlertType(null);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {product.stock === 0 && (
          <Button
            variant={hasBackInStockAlert ? 'default' : variant}
            size={size}
            onClick={handleBackInStockClick}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {alertType === 'back-in-stock' ? 'Back-in-Stock Alert' : 'Price Drop Alert'}
            </DialogTitle>
            <DialogDescription>
              {alertType === 'back-in-stock'
                ? `Get notified when ${product.name} is back in stock.`
                : `Get notified when ${product.name} drops to your target price.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {alertType === 'price-drop' && (
              <div className="space-y-2">
                <Label htmlFor="targetPrice">Target Price</Label>
                <div className="flex items-center gap-2">
                  <Muted className="text-sm">Current: {formatPrice(product.price)}</Muted>
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
                <Muted className="text-xs">
                  We'll notify you when the price drops to or below this amount.
                </Muted>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Notification Preferences</Label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={preferences.email}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, email: checked as boolean })
                    }
                  />
                  <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4" />
                    Email Notification
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={preferences.sms}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, sms: checked as boolean })
                    }
                  />
                  <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                    <Smartphone className="h-4 w-4" />
                    SMS Notification
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="push"
                    checked={preferences.push}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, push: checked as boolean })
                    }
                  />
                  <Label htmlFor="push" className="flex items-center gap-2 cursor-pointer">
                    <Bell className="h-4 w-4" />
                    Push Notification
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Notification Frequency</Label>
                <Select
                  value={preferences.frequency}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, frequency: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
                <Muted className="text-xs">
                  {preferences.frequency === 'immediate'
                    ? 'Get notified as soon as the alert triggers'
                    : preferences.frequency === 'daily'
                    ? 'Receive a daily summary of all alerts'
                    : 'Receive a weekly summary of all alerts'}
                </Muted>
              </div>
            </div>

            {(!preferences.email && !preferences.sms && !preferences.push) && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <Muted className="text-xs text-yellow-800 dark:text-yellow-200">
                  Please select at least one notification method
                </Muted>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAlert}
              disabled={
                (alertType === 'price-drop' && (!targetPrice || parseFloat(targetPrice) >= product.price)) ||
                (!preferences.email && !preferences.sms && !preferences.push)
              }
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedProductAlerts;

