import React, { useState } from 'react';
import { Product } from '@/data/dummyData';
import { H2, P, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Plus, Filter } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductReviewCard from './ProductReviewCard';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
  images?: string[];
}

const ProductReviewsSection: React.FC<{ product: Product }> = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev1',
      customerName: 'Sarah Johnson',
      rating: 5,
      title: 'Absolutely stunning!',
      comment: 'The quality exceeded my expectations. The fabric is luxurious and the fit is perfect. Highly recommend!',
      isVerifiedPurchase: true,
      createdAt: '2023-10-15',
      helpfulCount: 12,
      images: [
        'https://images.unsplash.com/photo-1581044777550-4cfa607037dc?q=80&w=1974&auto=format&fit=crop',
      ],
    },
    {
      id: 'rev2',
      customerName: 'Michael Chen',
      rating: 4,
      title: 'Great product, fast shipping',
      comment: 'Love the design and quality. Shipping was faster than expected. Only minor issue was the packaging could be better.',
      isVerifiedPurchase: true,
      createdAt: '2023-10-20',
      helpfulCount: 5,
    },
  ]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    images: [] as string[],
  });

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 || 0,
  }));

  const handleSubmitReview = () => {
    if (!newReview.title || !newReview.comment) {
      toast.error('Please fill in all required fields');
      return;
    }

    const review: Review = {
      id: `rev-${Date.now()}`,
      customerName: 'You',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulCount: 0,
      images: newReview.images,
    };

    setReviews([review, ...reviews]);
    toast.success('Review submitted!');
    setIsReviewDialogOpen(false);
    setNewReview({ rating: 5, title: '', comment: '', images: [] });
  };

  const handleHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
    toast.success('Thanks for your feedback!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <H2>Customer Reviews</H2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
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
            <P className="text-lg font-semibold ml-2">{averageRating.toFixed(1)}</P>
            <Muted className="ml-2">({reviews.length} reviews)</Muted>
          </div>
        </div>
        {isAuthenticated && (
          <Button onClick={() => setIsReviewDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Write Review
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-16">
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
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <Select
              value={filterRating === null ? 'all' : filterRating.toString()}
              onValueChange={(value) => setFilterRating(value === 'all' ? null : parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <P className="text-muted-foreground">No reviews found.</P>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <ProductReviewCard
                key={review.id}
                review={review}
                onHelpful={handleHelpful}
              />
            ))
          )}
        </div>
      </div>

      {/* Write Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>Share your experience with this product</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= newReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewTitle">Review Title *</Label>
              <Input
                id="reviewTitle"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Summarize your experience"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewComment">Your Review *</Label>
              <Textarea
                id="reviewComment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Tell others about your experience..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Photos (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <P className="text-sm text-muted-foreground">
                  Upload photos to help others see the product
                </P>
                <Button variant="outline" size="sm" className="mt-2">
                  Choose Files
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductReviewsSection;

