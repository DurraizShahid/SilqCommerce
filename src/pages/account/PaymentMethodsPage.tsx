import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, CreditCard, Wallet, CheckCircle, Shield, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank';
  name: string;
  last4?: string;
  brand?: string;
  expiry?: string;
  isDefault: boolean;
  provider?: string; // For wallets: 'apple', 'google', 'paypal'
}

const PaymentMethodsPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm1',
      type: 'card',
      name: 'Visa ending in 4242',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: 'pm2',
      type: 'wallet',
      name: 'Apple Pay',
      provider: 'apple',
      isDefault: false,
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: 'card' as 'card' | 'wallet' | 'bank',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholderName: '',
    brand: '',
    provider: '',
  });

  const handleAdd = () => {
    setEditingMethod(null);
    setFormData({
      type: 'card',
      cardNumber: '',
      expiry: '',
      cvv: '',
      cardholderName: '',
      brand: '',
      provider: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    if (method.type === 'card') {
      setFormData({
        type: 'card',
        cardNumber: `**** **** **** ${method.last4}`,
        expiry: method.expiry || '',
        cvv: '',
        cardholderName: method.name,
        brand: method.brand || '',
        provider: '',
      });
    } else {
      setFormData({
        type: method.type,
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardholderName: '',
        brand: '',
        provider: method.provider || '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (formData.type === 'card') {
      if (!formData.cardNumber || !formData.expiry || !formData.cvv || !formData.cardholderName) {
        toast.error('Please fill in all card details');
        return;
      }
      const last4 = formData.cardNumber.replace(/\s/g, '').slice(-4);
      const newMethod: PaymentMethod = {
        id: editingMethod?.id || `pm-${Date.now()}`,
        type: 'card',
        name: formData.cardholderName,
        last4,
        brand: formData.brand || 'Visa',
        expiry: formData.expiry,
        isDefault: editingMethod?.isDefault || paymentMethods.length === 0,
      };
      if (editingMethod) {
        setPaymentMethods((prev) =>
          prev.map((p) => (p.id === editingMethod.id ? newMethod : p))
        );
        toast.success('Payment method updated');
      } else {
        setPaymentMethods([...paymentMethods, newMethod]);
        toast.success('Payment method added');
      }
    } else if (formData.type === 'wallet') {
      if (!formData.provider) {
        toast.error('Please select a wallet provider');
        return;
      }
      const newMethod: PaymentMethod = {
        id: editingMethod?.id || `pm-${Date.now()}`,
        type: 'wallet',
        name: formData.provider === 'apple' ? 'Apple Pay' : formData.provider === 'google' ? 'Google Pay' : 'PayPal',
        provider: formData.provider,
        isDefault: editingMethod?.isDefault || paymentMethods.length === 0,
      };
      if (editingMethod) {
        setPaymentMethods((prev) =>
          prev.map((p) => (p.id === editingMethod.id ? newMethod : p))
        );
        toast.success('Payment method updated');
      } else {
        setPaymentMethods([...paymentMethods, newMethod]);
        toast.success('Payment method added');
      }
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
    toast.success('Payment method removed');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((p) => ({ ...p, isDefault: p.id === id }))
    );
    toast.success('Default payment method updated');
  };

  const getCardIcon = (brand?: string) => {
    return <CreditCard className="h-5 w-5" />;
  };

  const getWalletIcon = (provider?: string) => {
    return <Wallet className="h-5 w-5" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Payment Methods</H1>
          <P className="text-muted-foreground">Manage your saved payment methods</P>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Security & Wallet Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Payment Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <P className="text-sm font-medium">PCI-DSS Compliant</P>
                <Muted className="text-xs">All payment data is encrypted and secure</Muted>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <P className="text-sm font-medium">Tokenization</P>
                <Muted className="text-xs">Card details are tokenized for security</Muted>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <P className="text-sm font-medium">3D Secure</P>
                <Muted className="text-xs">Additional authentication for your protection</Muted>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Digital Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-sm mb-4">Store funds in your digital wallet for faster checkout</P>
            <Link to="/account/wallet">
              <Button variant="outline" className="w-full">
                <Wallet className="h-4 w-4 mr-2" />
                Manage Wallet
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-4">No payment methods saved.</P>
            <Button onClick={handleAdd}>Add Payment Method</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={method.isDefault ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {method.type === 'card' ? getCardIcon(method.brand) : getWalletIcon(method.provider)}
                    <div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      {method.type === 'card' && method.brand && (
                        <Muted className="text-sm">{method.brand}</Muted>
                      )}
                    </div>
                  </div>
                  {method.isDefault && (
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {method.type === 'card' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Muted>Card Number</Muted>
                      <P className="font-mono">**** **** **** {method.last4}</P>
                    </div>
                    {method.expiry && (
                      <div className="flex justify-between">
                        <Muted>Expires</Muted>
                        <P>{method.expiry}</P>
                      </div>
                    )}
                  </div>
                )}
                {method.type === 'wallet' && (
                  <P className="text-sm text-muted-foreground">
                    {method.provider === 'apple' && 'Secured with Touch ID / Face ID'}
                    {method.provider === 'google' && 'Secured with Google authentication'}
                    {method.provider === 'paypal' && 'Pay with your PayPal account'}
                  </P>
                )}
              </CardContent>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(method)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(method.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
            </DialogTitle>
            <DialogDescription>
              {editingMethod
                ? 'Update your payment method details'
                : 'Add a new credit card or digital wallet'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Type</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="cursor-pointer">Digital Wallet</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.type === 'card' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, '');
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      setFormData({ ...formData, cardNumber: formatted });
                    }}
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry (MM/YY) *</Label>
                    <Input
                      id="expiry"
                      placeholder="12/25"
                      value={formData.expiry}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setFormData({ ...formData, expiry: value });
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })
                      }
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name *</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={formData.cardholderName}
                    onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Card Brand</Label>
                  <Select
                    value={formData.brand}
                    onValueChange={(value) => setFormData({ ...formData, brand: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Visa">Visa</SelectItem>
                      <SelectItem value="Mastercard">Mastercard</SelectItem>
                      <SelectItem value="American Express">American Express</SelectItem>
                      <SelectItem value="Discover">Discover</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formData.type === 'wallet' && (
              <div className="space-y-2">
                <Label htmlFor="provider">Wallet Provider *</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value) => setFormData({ ...formData, provider: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apple">Apple Pay</SelectItem>
                    <SelectItem value="google">Google Pay</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
                <P className="text-xs text-muted-foreground">
                  You'll be redirected to authenticate with your wallet provider
                </P>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingMethod ? 'Update' : 'Add'} Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentMethodsPage;

