import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { vendors, vendorReviews, products } from '@/data/dummyData';
import { H1, H2, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Award, TrendingUp, Package, Users, MapPin, Globe, Instagram, Facebook, Twitter } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/ProductCard';
import FollowVendorButton from '@/components/FollowVendorButton';

const VendorProfilePage: React.FC = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const vendor = vendors.find((v) => v.id === vendorId);
  const { formatPrice } = useCurrency();

  if (!vendor) {
    return (
      <div className="text-center py-16">
        <H1>Vendor Not Found</H1>
        <P className="text-muted-foreground">The vendor you're looking for doesn't exist.</P>
        <Link to="/products">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
  const reviews = vendorReviews.filter((r) => r.vendorId === vendor.id);
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : vendor.rating;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 || 0,
  }));

  return (
    <div className="space-y-8">
      {/* Vendor Header */}
      <div className="relative">
        {vendor.coverImageUrl && (
          <div className="h-64 w-full overflow-hidden rounded-lg">
            <img
              src={vendor.coverImageUrl}
              alt={vendor.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={vendor.logoUrl} alt={vendor.name} />
                <AvatarFallback>{vendor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <H1 className="mb-0">{vendor.name}</H1>
                  {vendor.isVerified && (
                    <Badge className="bg-blue-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {vendor.isPremium && (
                    <Badge className="bg-accent-gold">
                      <Award className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  {vendor.badges.includes('Top Seller') && (
                    <Badge variant="default">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Top Seller
                    </Badge>
                  )}
                </div>
                <P className="text-muted-foreground mb-4">{vendor.description}</P>
                <div className="mb-4">
                  <FollowVendorButton vendorId={vendor.id} vendorName={vendor.name} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {vendor.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {vendor.location}
                    </div>
                  )}
                  {vendor.website && (
                    <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent-gold">
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {vendor.socialLinks?.instagram && (
                    <a href={`https://instagram.com/${vendor.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent-gold">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </a>
                  )}
                  {vendor.socialLinks?.facebook && (
                    <a href={`https://facebook.com/${vendor.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent-gold">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <H2 className="mb-0">{averageRating.toFixed(1)}</H2>
                </div>
                <Muted>{vendor.totalReviews} reviews</Muted>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <Muted className="text-xs">{vendor.totalReviews} reviews</Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Joined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(vendor.joinedDate).getFullYear()}</div>
            <Muted className="text-xs">{new Date(vendor.joinedDate).toLocaleDateString()}</Muted>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Products ({vendorProducts.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <Star className="h-4 w-4 mr-2" />
            Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vendorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {vendorProducts.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <P className="text-muted-foreground">No products available from this vendor.</P>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Rating Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Muted>{vendor.totalReviews} total reviews</Muted>
                </div>
                <Separator />
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-sm">{rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <P className="font-semibold">{review.customerName}</P>
                          {review.isVerifiedPurchase && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 ml-auto">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <P className="font-semibold mb-1">{review.title}</P>
                        <P className="text-sm text-muted-foreground mb-2">{review.comment}</P>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                            Helpful ({review.helpfulCount})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {reviews.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <P className="text-muted-foreground">No reviews yet.</P>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About {vendor.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <P>{vendor.description}</P>
              <div>
                <P className="font-semibold mb-2">Categories</P>
                <div className="flex flex-wrap gap-2">
                  {vendor.categories.map((cat) => (
                    <Badge key={cat} variant="outline">{cat}</Badge>
                  ))}
                </div>
              </div>
              {vendor.location && (
                <div>
                  <P className="font-semibold mb-2">Location</P>
                  <P className="text-muted-foreground">{vendor.location}</P>
                </div>
              )}
              <div>
                <P className="font-semibold mb-2">Member Since</P>
                <P className="text-muted-foreground">
                  {new Date(vendor.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </P>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorProfilePage;

