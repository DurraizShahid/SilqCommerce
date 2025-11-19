import React from 'react';
import { H1, P, Large, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Trash2, Bookmark, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrency } from '@/context/CurrencyContext';

const CartPage: React.FC = () => {
  const { cartItems, savedForLater, updateQuantity, removeFromCart, clearCart, cartTotal, saveForLater, moveToCart, removeFromSaved } = useCart();
  const { formatPrice } = useCurrency();

  const handleQuantityChange = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <H1 className="mb-2">Your Shopping Cart</H1>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Review your selected items before checkout.
        </P>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <P className="text-xl text-muted-foreground">Your cart is empty.</P>
          <Link to="/products">
            <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Product</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link to={`/products/${item.id}`} className="hover:underline">
                            {item.name}
                          </Link>
                          <Muted className="block text-sm">{item.category}</Muted>
                        </TableCell>
                        <TableCell className="text-center">{formatPrice(item.price)}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e)}
                            className="w-20 text-center"
                          />
                        </TableCell>
                        <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => saveForLater(item.id)} title="Save for later">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
              <Link to="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <P className="text-lg">Subtotal:</P>
                  <P className="text-lg font-semibold">{formatPrice(cartTotal)}</P>
                </div>
                <div className="flex justify-between">
                  <P className="text-lg">Shipping:</P>
                  <P className="text-lg font-semibold">Free</P>
                </div>
                <div className="border-t pt-4 flex justify-between items-center">
                  <Large className="text-2xl font-bold">Total:</Large>
                  <Large className="text-2xl font-bold text-accent-gold">{formatPrice(cartTotal)}</Large>
                </div>
                <Link to="/checkout" className="w-full">
                  <Button className="w-full py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;