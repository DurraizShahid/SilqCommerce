import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { P, Muted } from '@/components/ui/typography';
import { Star, ThumbsUp, ThumbsDown, CheckCircle, Image as ImageIcon, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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

interface ProductReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

const ProductReviewCard: React.FC<ProductReviewCardProps> = ({ review, onHelpful }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = () => {
    if (!hasVoted && onHelpful) {
      onHelpful(review.id);
      setHasVoted(true);
    }
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar>
              {review.customerAvatar ? (
                <AvatarImage src={review.customerAvatar} alt={review.customerName} />
              ) : null}
              <AvatarFallback>{review.customerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <P className="font-semibold">{review.customerName}</P>
                    {review.isVerifiedPurchase && (
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
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
                    <Muted className="text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Muted>
                  </div>
                </div>
              </div>

              <div>
                <P className="font-semibold mb-1">{review.title}</P>
                <P className="text-sm text-muted-foreground whitespace-pre-wrap">{review.comment}</P>
              </div>

              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {review.images.slice(0, 3).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(image)}
                      className="relative aspect-square overflow-hidden rounded-md border hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 2 && review.images && review.images.length > 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                          +{review.images.length - 3}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHelpful}
                  disabled={hasVoted}
                  className="h-auto py-1"
                >
                  <ThumbsUp className={`h-4 w-4 mr-1 ${hasVoted ? 'text-primary' : ''}`} />
                  <span className="text-xs">Helpful ({review.helpfulCount})</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl p-0">
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Review image"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
                onClick={() => setIsImageModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductReviewCard;

