import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, CreditCard, MapPin, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { Product } from '@/data/dummyData';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { P, Muted } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';

interface OneClickPurchaseProps {
  product: Product;
  variant?: string;
  quantity?: number;
  onComplete?: () => void;
}

interface SavedPaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple-pay' | 'google-pay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

interface SavedAddress {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const OneClickPurchase: React.FC<OneClickPurchaseProps> = ({
  product,
  variant,
  quantity = 1,
  onComplete,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<SavedPaymentMethod | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);

  // Load saved payment methods and addresses
  const [savedPayments, setSavedPayments] = useState<SavedPaymentMethod[]>(() => {
    try {
      const stored = localStorage.getItem('silqcommerce_saved_payments');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem('silqcommerce_saved_addresses');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    // Set defaults
    const defaultPayment = savedPayments.find((p) => p.isDefault) || savedPayments[0] || null;
    const defaultAddress = savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null;
    setSelectedPayment(defaultPayment);
    setSelectedAddress(defaultAddress);
  }, [savedPayments, savedAddresses]);

  const handleOneClickPurchase = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to use one-click purchase');
      return;
    }

    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create order
    const order = {
      id: `order-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity,
      variant,
      price: product.price,
      total: product.price * quantity,
      paymentMethod: selectedPayment,
      shippingAddress: selectedAddress,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Save order to localStorage
    try {
      const orders = JSON.parse(localStorage.getItem('silqcommerce_orders') || '[]');
      orders.push(order);
      localStorage.setItem('silqcommerce_orders', JSON.stringify(orders));
    } catch {
      // Handle error
    }

    setIsProcessing(false);
    setIsDialogOpen(false);
    toast.success('Order placed successfully!');
    
    if (onComplete) {
      onComplete();
    }
  };

  const totalPrice = product.price * quantity;
  const shipping = 0; // Free shipping for luxury items
  const tax = totalPrice * 0.1; // 10% tax
  const finalTotal = totalPrice + shipping + tax;

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => toast.error('Please sign in to use one-click purchase')}
        className="w-full bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
      >
        <Zap className="h-4 w-4 mr-2" />
        Sign In for One-Click Purchase
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleOneClickPurchase}
        className="w-full bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
        disabled={product.stock === 0}
      >
        <Zap className="h-4 w-4 mr-2" />
        Buy Now (One-Click)
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              One-Click Purchase
            </DialogTitle>
            <DialogDescription>
              Review your order and confirm purchase
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Product Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <P className="font-semibold">{product.name}</P>
                    <Muted className="text-sm">{product.category}</Muted>
                    {variant && (
                      <Badge variant="outline" className="mt-1">
                        {variant}
                      </Badge>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <Muted className="text-sm">Quantity: {quantity}</Muted>
                      <P className="font-semibold">{formatPrice(product.price)}</P>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAddress ? (
                  <div className="space-y-2">
                    <P className="font-semibold">{selectedAddress.name}</P>
                    <Muted className="text-sm">
                      {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state}{' '}
                      {selectedAddress.zip}
                    </Muted>
                    <Muted className="text-sm">{selectedAddress.country}</Muted>
                    <Muted className="text-sm">Phone: {selectedAddress.phone}</Muted>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <Muted>No saved address. Please add one in your account settings.</Muted>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPayment ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <P className="font-semibold capitalize">
                        {selectedPayment.type === 'card' ? selectedPayment.brand : selectedPayment.type}
                      </P>
                      {selectedPayment.last4 && (
                        <Muted className="text-sm">•••• {selectedPayment.last4}</Muted>
                      )}
                    </div>
                    {selectedPayment.isDefault && (
                      <Badge variant="outline">Default</Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <Muted>No saved payment method. Please add one in your account settings.</Muted>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <Muted>Subtotal</Muted>
                  <P>{formatPrice(totalPrice)}</P>
                </div>
                <div className="flex justify-between">
                  <Muted>Shipping</Muted>
                  <P>{formatPrice(shipping)}</P>
                </div>
                <div className="flex justify-between">
                  <Muted>Tax</Muted>
                  <P>{formatPrice(tax)}</P>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <P>Total</P>
                  <P className="text-accent-gold">{formatPrice(finalTotal)}</P>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              disabled={!selectedPayment || !selectedAddress || isProcessing}
              className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90"
            >
              {isProcessing ? (
                <>
                  <Package className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Purchase
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OneClickPurchase;

