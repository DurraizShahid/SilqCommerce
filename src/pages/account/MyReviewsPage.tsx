import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Edit, Trash2, Package, Calendar, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  helpfulCount: number;
  createdAt: string;
  orderId: string;
  isVerifiedPurchase: boolean;
}

const MyReviewsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      productId: 'prod1',
      productName: 'Luxury Designer Handbag',
      productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000',
      rating: 5,
      title: 'Absolutely stunning!',
      comment: 'The quality is exceptional and the design is timeless. Highly recommend!',
      images: [],
      helpfulCount: 12,
      createdAt: '2023-11-15',
      orderId: 'ORD-123456',
      isVerifiedPurchase: true,
    },
    {
      id: 'r2',
      productId: 'prod2',
      productName: 'Premium Leather Wallet',
      productImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000',
      rating: 4,
      title: 'Great quality',
      comment: 'Good wallet, but expected a bit more for the price.',
      images: [],
      helpfulCount: 5,
      createdAt: '2023-11-10',
      orderId: 'ORD-123457',
      isVerifiedPurchase: true,
    },
  ]);

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return false; // In real app, check review status
    if (filter === 'published') return true;
    return true;
  });

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingReview) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === editingReview.id
          ? { ...r, ...editForm, updatedAt: new Date().toISOString() }
          : r
      )
    );
    toast.success('Review updated');
    setIsEditDialogOpen(false);
    setEditingReview(null);
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success('Review deleted');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>My Reviews</H1>
          <P className="text-muted-foreground">Manage your product reviews</P>
        </div>
        <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-2">No reviews yet</P>
            <P className="text-sm text-muted-foreground mb-4">
              Start reviewing products you've purchased
            </P>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Link to={`/products/${review.productId}`}>
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={`/products/${review.productId}`}>
                          <H1 className="text-lg mb-1 hover:text-primary">
                            {review.productName}
                          </H1>
                        </Link>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          {review.isVerifiedPurchase && (
                            <Badge variant="outline" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(review)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <H1 className="text-lg font-semibold mb-2">{review.title}</H1>
                    <P className="text-muted-foreground mb-4">{review.comment}</P>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {review.helpfulCount} helpful
                      </div>
                      <Muted>Order: {review.orderId}</Muted>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your review for {editingReview?.productName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <RadioGroup
                value={editForm.rating.toString()}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, rating: parseInt(value) })
                }
                className="flex gap-4"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewTitle">Title</Label>
              <Input
                id="reviewTitle"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewComment">Comment</Label>
              <Textarea
                id="reviewComment"
                value={editForm.comment}
                onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyReviewsPage;

