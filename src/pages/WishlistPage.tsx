import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { H1, P, Muted } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";

const WishlistPage: React.FC = () => {
  const { wishlistedItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <H1 className="mb-2">Your Wishlist</H1>
        <P className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Save your favorite pieces and move them to the cart when you're ready.
        </P>
      </div>

      {wishlistedItems.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <P className="text-muted-foreground">You haven&apos;t saved any pieces yet.</P>
          <Link to="/products">
            <Button>Browse collection</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <Muted>{wishlistedItems.length} item(s) saved</Muted>
            <Button variant="ghost" onClick={clearWishlist}>
              Clear wishlist
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistedItems.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <img src={item.imageUrl} alt={item.name} className="h-64 w-full object-cover" />
                </CardHeader>
                <CardContent className="flex-grow space-y-2 pt-4">
                  <CardTitle>{item.name}</CardTitle>
                  <P className="text-accent-gold font-semibold">{formatPrice(item.price)}</P>
                  <Muted>Added {new Date(item.addedAt).toLocaleDateString()}</Muted>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link to={`/products/${item.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View details
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={() => removeFromWishlist(item.id)}>
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;

