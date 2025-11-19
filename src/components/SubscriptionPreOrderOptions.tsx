import React, { useState } from 'react';
import { Product } from '@/data/dummyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { P } from '@/components/ui/typography';
import { useCurrency } from '@/context/CurrencyContext';
import { Calendar, Repeat, CreditCard } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface SubscriptionPreOrderOptionsProps {
  product: Product;
}

const SubscriptionPreOrderOptions: React.FC<SubscriptionPreOrderOptionsProps> = ({ product }) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<string>('monthly');
  const [preOrderQuantity, setPreOrderQuantity] = useState(1);

  if (!product.isSubscription && !product.isPreOrder) {
    return null;
  }

  const handleSubscribe = () => {
    toast.success(`Subscription added! You'll receive ${product.name} ${subscriptionFrequency}.`);
    // In real app, this would create a subscription
  };

  const handlePreOrder = () => {
    addToCart(product, preOrderQuantity);
    toast.success(`Pre-order added to cart! Expected release: ${product.preOrderReleaseDate}`);
  };

  return (
    <div className="space-y-4">
      {product.isSubscription && (
        <Card className="border-accent-gold">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-accent-gold" />
              <CardTitle>Subscribe & Save</CardTitle>
              <Badge className="bg-green-500">Save 10%</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <P className="text-sm text-muted-foreground">
              Get this product delivered automatically on a schedule. Cancel anytime.
            </P>
            <div className="space-y-2">
              <Label>Delivery Frequency</Label>
              <Select value={subscriptionFrequency} onValueChange={setSubscriptionFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <P className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </P>
                <P className="text-2xl font-bold text-accent-gold">
                  {formatPrice(product.price * 0.9)}
                </P>
              </div>
              <P className="text-xs text-muted-foreground">
                Save {formatPrice(product.price * 0.1)} per delivery
              </P>
            </div>
            <Button className="w-full" onClick={handleSubscribe}>
              <Repeat className="h-4 w-4 mr-2" />
              Subscribe Now
            </Button>
          </CardContent>
        </Card>
      )}

      {product.isPreOrder && (
        <Card className="border-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <CardTitle>Pre-Order Available</CardTitle>
              <Badge variant="outline">Limited Edition</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <P className="text-sm text-muted-foreground">
              Reserve this product before it's released. Pay a deposit now, balance when it ships.
            </P>
            <div className="space-y-2">
              <Label>Expected Release Date</Label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <P className="font-semibold">
                  {product.preOrderReleaseDate
                    ? new Date(product.preOrderReleaseDate).toLocaleDateString()
                    : 'TBA'}
                </P>
              </div>
            </div>
            {product.preOrderDeposit && (
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between items-center">
                  <P className="text-sm">Deposit Required</P>
                  <P className="font-semibold flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    {formatPrice(product.preOrderDeposit)}
                  </P>
                </div>
                <div className="flex justify-between items-center">
                  <P className="text-sm">Remaining Balance</P>
                  <P className="font-semibold">
                    {formatPrice(product.price - product.preOrderDeposit)}
                  </P>
                </div>
                <P className="text-xs text-muted-foreground">
                  Remaining balance will be charged when your order ships.
                </P>
              </div>
            )}
            <Button className="w-full" onClick={handlePreOrder}>
              <Calendar className="h-4 w-4 mr-2" />
              Pre-Order Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubscriptionPreOrderOptions;

