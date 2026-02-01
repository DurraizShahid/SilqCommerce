import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/dummyData';
import { H1, P, Large, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useComparison } from '@/context/ComparisonContext';
import { useRecentlyViewed } from '@/context/RecentlyViewedContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Heart, GitCompare } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import ProductVariantSelector from '@/components/ProductVariantSelector';
import ProductAlertButton from '@/components/ProductAlertButton';
import EnhancedProductAlerts from '@/components/EnhancedProductAlerts';
import OneClickPurchase from '@/components/OneClickPurchase';
import ProductMediaViewer from '@/components/ProductMediaViewer';
import ProductReviewsSection from '@/components/ProductReviewsSection';
import AIProductRecommendations from '@/components/AIProductRecommendations';
import SizePrediction from '@/components/SizePrediction';
import SocialShareButtons from '@/components/SocialShareButtons';
import SubscriptionPreOrderOptions from '@/components/SubscriptionPreOrderOptions';
import { useAuth } from '@/context/AuthContext';
import EcoFriendlyBadge from '@/components/sustainability/EcoFriendlyBadge';
import SustainabilityScore from '@/components/sustainability/SustainabilityScore';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToComparison, isInComparison, canAddMore } = useComparison();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product, addToRecentlyViewed]);

  if (!product) {
    return (
      <div className="text-center py-12">
        <H1 className="mb-4">Product Not Found</H1>
        <P className="text-lg text-muted-foreground">
          The product you are looking for does not exist.
        </P>
        <Link to="/products">
          <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <ProductMediaViewer product={product} />
      <div className="space-y-6">
        <H1 className="text-4xl font-bold">{product.name}</H1>
        <P className="text-3xl font-bold text-accent-gold">
          {formatPrice(product.price)}
        </P>
        <P className="text-lg text-foreground leading-relaxed">
          {product.description}
        </P>
        <div className="space-y-2">
          <Large>Category: <span className="font-normal text-muted-foreground">{product.category}</span></Large>
          <Large>Availability: <span className="font-normal text-muted-foreground">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></Large>
        </div>

        {/* AI Size Prediction */}
        {(product.category === 'Clothing' || product.category === 'Shoes' || product.category === 'Watches') && (
          <div className="border-t pt-6">
            <SizePrediction
              productId={product.id}
              productName={product.name}
              category={product.category}
              onSizeSelected={(size) => {
                toast.success(`Size ${size} selected`);
                // Could integrate with variant selector
              }}
            />
          </div>
        )}

        {/* Product Variations */}
        {product.variations && product.variations.length > 0 && (
          <div className="border-t pt-6">
            <ProductVariantSelector 
              product={product} 
              onVariantChange={setSelectedVariants}
            />
          </div>
        )}

        {/* Enhanced One-Click Purchase */}
        <div className="border-t pt-6">
          <OneClickPurchase
            product={product}
            variant={selectedVariants ? Object.values(selectedVariants).join(', ') : undefined}
            quantity={1}
            onComplete={() => {
              toast.success('Order placed successfully!');
            }}
          />
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={isInWishlist(product.id) ? "secondary" : "outline"}
            className="flex-1"
            onClick={() => addToWishlist(product)}
          >
            <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            {isInWishlist(product.id) ? "Saved" : "Wishlist"}
          </Button>
          <Button
            type="button"
            variant={isInComparison(product.id) ? "secondary" : "outline"}
            className="flex-1"
            onClick={() => addToComparison(product)}
            disabled={!canAddMore && !isInComparison(product.id)}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            {isInComparison(product.id) ? "In Compare" : "Compare"}
          </Button>
        </div>

        {/* Subscription & Pre-Order Options */}
        <SubscriptionPreOrderOptions product={product} />

        {/* Enhanced Product Alerts */}
        <div className="border-t pt-6">
          <EnhancedProductAlerts product={product} />
        </div>
        {/* Sustainability Info */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <EcoFriendlyBadge type="eco-friendly" />
            <EcoFriendlyBadge type="fair-trade" />
            <EcoFriendlyBadge type="organic" />
          </div>
          <SustainabilityScore
            score={85}
            breakdown={{
              materials: 90,
              production: 80,
              shipping: 85,
              packaging: 90,
            }}
            showBreakdown={true}
          />
        </div>

        <div className="flex gap-2">
          <SocialShareButtons
            productName={product.name}
            productUrl={`/products/${product.id}`}
            productImage={product.imageUrl}
          />
        </div>

        <Link to="/products">
          <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
            Continue Shopping
          </Button>
        </Link>
      </div>

      {/* Product Reviews Section */}
      <div className="col-span-full mt-12">
        <ProductReviewsSection product={product} />
      </div>

      {/* AI Product Recommendations */}
      <div className="col-span-full mt-12">
        <AIProductRecommendations productId={product.id} type="related" limit={4} />
      </div>
      <div className="col-span-full mt-8">
        <AIProductRecommendations productId={product.id} type="cross-sell" limit={4} />
      </div>
      <div className="col-span-full mt-8">
        <AIProductRecommendations productId={product.id} type="upsell" limit={4} />
      </div>
      <div className="col-span-full mt-8">
        <AIProductRecommendations type="personalized" limit={4} />
      </div>
    </div>
  );
};

export default ProductDetailPage;