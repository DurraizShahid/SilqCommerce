import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { H1, H2, P, Muted } from "@/components/ui/typography";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import CharityDonation from "@/components/sustainability/CharityDonation";
import { Leaf } from "lucide-react";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(8, "Enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["card", "wallet", "bnpl"]),
  cardNumber: z.string().min(12, "Enter a valid card number"),
  expiry: z.string().min(4, "MM/YY"),
  cvv: z.string().min(3, "CVV"),
  orderNotes: z.string().optional(),
  promoCode: z.string().optional(),
  isGift: z.boolean().default(false),
  giftMessage: z.string().optional(),
  giftWrapping: z.boolean().default(false),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const shippingRates = {
  standard: 0,
  express: 25,
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [charityDonation, setCharityDonation] = useState(0);
  const [carbonOffset, setCarbonOffset] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: "standard",
      paymentMethod: "card",
      isGift: false,
      giftWrapping: false,
    },
  });

  const shippingMethod = watch("shippingMethod", "standard");
  const isGift = watch("isGift", false);
  const giftWrapping = watch("giftWrapping", false);

  useEffect(() => {
    // Load addresses from localStorage
    const addresses = JSON.parse(localStorage.getItem("saved_addresses") || "[]");
    setSavedAddresses(addresses);
    const defaultAddress = addresses.find((a: any) => a.isDefault);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      setValue("fullName", defaultAddress.fullName);
      setValue("phone", defaultAddress.phone);
      setValue("address", defaultAddress.address);
      setValue("city", defaultAddress.city);
      setValue("state", defaultAddress.state);
      setValue("postalCode", defaultAddress.postalCode);
      setValue("country", defaultAddress.country);
    }
  }, [setValue]);

  const handleAddressSelect = (addressId: string) => {
    const address = savedAddresses.find((a: any) => a.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setValue("fullName", address.fullName);
      setValue("phone", address.phone);
      setValue("address", address.address);
      setValue("city", address.city);
      setValue("state", address.state);
      setValue("postalCode", address.postalCode);
      setValue("country", address.country);
    }
  };

  const giftWrappingCost = giftWrapping ? 10 : 0;

  const handleApplyPromo = () => {
    // Mock promo codes
    const validCodes: Record<string, number> = {
      "SAVE10": 10,
      "WELCOME20": 20,
      "LUXURY15": 15,
    };
    if (promoCode.toUpperCase() in validCodes) {
      setAppliedPromo(promoCode.toUpperCase());
      setDiscount(validCodes[promoCode.toUpperCase()]);
      setValue("promoCode", promoCode.toUpperCase());
      toast.success(`Promo code applied! ${validCodes[promoCode.toUpperCase()]}% off`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const shippingCost = useMemo(() => shippingRates[shippingMethod], [shippingMethod]);
  const subtotalWithDiscount = useMemo(() => {
    if (discount > 0) {
      return cartTotal * (1 - discount / 100);
    }
    return cartTotal;
  }, [cartTotal, discount]);
  const orderTotal = useMemo(() => 
    subtotalWithDiscount + shippingCost + giftWrappingCost + charityDonation + carbonOffset, 
    [subtotalWithDiscount, shippingCost, giftWrappingCost, charityDonation, carbonOffset]
  );

  if (cartItems.length === 0) {
    return (
      <div className="text-center space-y-6 py-16">
        <H1>Your cart is empty</H1>
        <P className="text-muted-foreground">Add a few pieces to continue to checkout.</P>
        <Button onClick={() => navigate("/products")} variant="outline">
          Browse collection
        </Button>
      </div>
    );
  }

  const onSubmit = async (values: CheckoutValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    toast.success("Order placed successfully!");
    clearCart();
    navigate("/checkout/success", {
      state: {
        orderId,
        email: values.email,
        shippingMethod: values.shippingMethod,
        total: orderTotal,
      },
      replace: true,
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <H1>Secure Checkout</H1>
        <P className="text-lg text-muted-foreground">Complete your order with confidence.</P>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" {...register("phone")} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedAddresses.length > 0 && (
                <div className="space-y-2 pb-4 border-b">
                  <Label>Use Saved Address</Label>
                  <Select value={selectedAddressId} onValueChange={handleAddressSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a saved address" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedAddresses.map((address: any) => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.fullName} - {address.address}, {address.city}
                          {address.isDefault && " (Default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Link to="/account/addresses" className="text-sm text-primary hover:underline">
                    Manage addresses
                  </Link>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} />
                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" {...register("postalCode")} />
                {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Shipping method</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["standard", "express"] as const).map((method) => (
                    <label
                      key={method}
                      className={`cursor-pointer rounded-lg border p-4 ${
                        shippingMethod === method ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <input type="radio" value={method} className="sr-only" {...register("shippingMethod")} />
                      <H2 className="text-lg font-semibold capitalize">{method}</H2>
                      <P className="text-sm text-muted-foreground">
                        {method === "standard"
                          ? "3-5 business days · Complimentary"
                          : `1-2 business days · ${formatPrice(shippingRates.express)}`}
                      </P>
                    </label>
                  ))}
                </div>
                {errors.shippingMethod && <p className="text-sm text-destructive">{errors.shippingMethod.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="orderNotes">Order notes</Label>
                <Textarea id="orderNotes" rows={3} placeholder="Delivery instructions, gift notes, etc." {...register("orderNotes")} />
              </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Payment method</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {["card", "wallet", "bnpl"].map((method) => (
                    <label
                      key={method}
                      className={`cursor-pointer rounded-lg border p-4 text-center capitalize ${
                        watch("paymentMethod") === method ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <input type="radio" value={method} className="sr-only" {...register("paymentMethod")} />
                      {method === "bnpl" ? "Pay in 4" : method}
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && <p className="text-sm text-destructive">{errors.paymentMethod.message}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cardNumber">Card number</Label>
                  <Input id="cardNumber" placeholder="4242 4242 4242 4242" {...register("cardNumber")} />
                  {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                  <Input id="expiry" placeholder="08/28" {...register("expiry")} />
                  {errors.expiry && <p className="text-sm text-destructive">{errors.expiry.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" {...register("cvv")} />
                  {errors.cvv && <p className="text-sm text-destructive">{errors.cvv.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gift Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="isGift" {...register("isGift")} checked={isGift} onCheckedChange={(checked) => setValue("isGift", checked as boolean)} />
                <Label htmlFor="isGift" className="cursor-pointer">This is a gift</Label>
              </div>
              {isGift && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="giftMessage">Gift Message (optional)</Label>
                    <Textarea id="giftMessage" placeholder="Add a personal message..." {...register("giftMessage")} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="giftWrapping" {...register("giftWrapping")} checked={giftWrapping} onCheckedChange={(checked) => setValue("giftWrapping", checked as boolean)} />
                    <Label htmlFor="giftWrapping" className="cursor-pointer">Add gift wrapping (+{formatPrice(10)})</Label>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <CharityDonation
            onDonationChange={(amount) => setCharityDonation(amount)}
          />

          {/* Carbon Offset */}
          <Card className="border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Carbon Offset
              </CardTitle>
              <CardDescription>
                Offset your order's carbon footprint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Muted className="text-sm">Estimated footprint</Muted>
                  <P className="font-semibold">~{Math.round(cartTotal * 0.1)} kg CO₂</P>
                </div>
                <div className="flex items-center justify-between">
                  <Muted className="text-sm">Offset cost</Muted>
                  <P className="text-lg font-bold text-green-600">
                    {formatPrice(Math.round(cartTotal * 0.1) * 0.01)}
                  </P>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCarbonOffset"
                  checked={carbonOffset > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCarbonOffset(Math.round(cartTotal * 0.1) * 0.01);
                    } else {
                      setCarbonOffset(0);
                    }
                  }}
                />
                <Label htmlFor="includeCarbonOffset" className="cursor-pointer flex-1">
                  <P className="text-sm font-medium">Include carbon offset</P>
                  <Muted className="text-xs">
                    Support verified carbon reduction projects
                  </Muted>
                </Label>
              </div>
              <Link to="/sustainability/carbon-footprint" className="text-sm text-primary hover:underline">
                Calculate exact footprint →
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded object-cover" />
                  <div className="flex-grow">
                    <P className="font-semibold">{item.name}</P>
                    <Muted>
                  {item.quantity} × {formatPrice(item.price)}
                    </Muted>
                  </div>
                <P className="font-semibold">{formatPrice(item.price * item.quantity)}</P>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span>-{formatPrice(cartTotal - subtotalWithDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)}</span>
                </div>
                {giftWrapping && (
                  <div className="flex justify-between">
                    <span>Gift Wrapping</span>
                    <span>{formatPrice(giftWrappingCost)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <Label htmlFor="promoCode">Promo Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="promoCode"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={!!appliedPromo}
                  />
                  {appliedPromo ? (
                    <Button type="button" variant="outline" onClick={() => {
                      setPromoCode("");
                      setAppliedPromo(null);
                      setDiscount(0);
                      setValue("promoCode", "");
                    }}>
                      Remove
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" onClick={handleApplyPromo}>
                      Apply
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Place order"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

