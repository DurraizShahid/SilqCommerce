import React, { useState, useEffect } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Package, Users, MapPin, UserX } from 'lucide-react';
import { vendors, products } from '@/data/dummyData';
import FollowVendorButton from '@/components/FollowVendorButton';
import { useCurrency } from '@/context/CurrencyContext';

const FollowingPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [followedVendorIds, setFollowedVendorIds] = useState<string[]>([]);

  useEffect(() => {
    // Load followed vendors from localStorage
    const followed = JSON.parse(localStorage.getItem('followed_vendors') || '[]');
    setFollowedVendorIds(followed);
  }, []);

  const followedVendors = vendors.filter((v) => followedVendorIds.includes(v.id));

  const handleUnfollow = (vendorId: string) => {
    const updated = followedVendorIds.filter((id) => id !== vendorId);
    setFollowedVendorIds(updated);
    localStorage.setItem('followed_vendors', JSON.stringify(updated));
  };

  if (followedVendors.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <H1>Following</H1>
          <P className="text-muted-foreground">Vendors you're following</P>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <UserX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-2">You're not following any vendors yet</P>
            <P className="text-sm text-muted-foreground mb-4">
              Follow your favorite vendors to get updates on new products and promotions
            </P>
            <Link to="/products">
              <Button>Browse Vendors</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <H1>Following</H1>
        <P className="text-muted-foreground">
          {followedVendors.length} vendor{followedVendors.length !== 1 ? 's' : ''} you're following
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {followedVendors.map((vendor) => {
          const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
          return (
            <Card key={vendor.id} className="overflow-hidden">
              <Link to={`/vendor/${vendor.id}`}>
                <div className="relative h-32 overflow-hidden">
                  {vendor.coverImageUrl ? (
                    <img
                      src={vendor.coverImageUrl}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent-gold/20 to-primary/20" />
                  )}
                </div>
              </Link>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {vendor.logoUrl ? (
                        <AvatarImage src={vendor.logoUrl} alt={vendor.name} />
                      ) : null}
                      <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={`/vendor/${vendor.id}`}>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      </Link>
                      {vendor.isVerified && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendor.description && (
                  <P className="text-sm text-muted-foreground line-clamp-2">
                    {vendor.description}
                  </P>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{vendor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{vendorProducts.length} products</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/vendor/${vendor.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Store
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => handleUnfollow(vendor.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FollowingPage;

