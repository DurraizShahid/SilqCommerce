import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { P, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, ShoppingBag, Star, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface ActivityFeedCardProps {
  activity: {
    id: string;
    type: 'purchase' | 'review' | 'wishlist' | 'follow' | 'share' | 'collection';
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    product?: {
      id: string;
      name: string;
      image?: string;
      price: number;
    };
    vendor?: {
      id: string;
      name: string;
      logo?: string;
    };
    content?: string;
    timestamp: string;
    likes?: number;
    comments?: number;
  };
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

const ActivityFeedCard: React.FC<ActivityFeedCardProps> = ({
  activity,
  onLike,
  onComment,
  onShare,
}) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="h-4 w-4 text-green-600" />;
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'wishlist':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'share':
        return <Share2 className="h-4 w-4 text-purple-600" />;
      case 'collection':
        return <ShoppingBag className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  const getActivityText = () => {
    switch (activity.type) {
      case 'purchase':
        return 'purchased';
      case 'review':
        return 'reviewed';
      case 'wishlist':
        return 'added to wishlist';
      case 'follow':
        return 'started following';
      case 'share':
        return 'shared';
      case 'collection':
        return 'added to collection';
      default:
        return 'did something';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-4">
        <div className="flex gap-3">
          <Avatar>
            {activity.user.avatar ? (
              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            ) : null}
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to={`/user/${activity.user.id}`}>
                    <P className="font-semibold hover:underline">{activity.user.name}</P>
                  </Link>
                  <span className="text-muted-foreground">{getActivityText()}</span>
                  {activity.product && (
                    <Link to={`/products/${activity.product.id}`}>
                      <span className="font-medium hover:underline">{activity.product.name}</span>
                    </Link>
                  )}
                  {activity.vendor && (
                    <Link to={`/vendor/${activity.vendor.id}`}>
                      <span className="font-medium hover:underline">{activity.vendor.name}</span>
                    </Link>
                  )}
                  {getActivityIcon(activity.type)}
                </div>
                {activity.content && (
                  <Muted className="text-sm mt-1 block">{activity.content}</Muted>
                )}
                <Muted className="text-xs mt-1 block">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </Muted>
              </div>
            </div>

            {activity.product && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                {activity.product.image && (
                  <img
                    src={activity.product.image}
                    alt={activity.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <P className="text-sm font-medium">{activity.product.name}</P>
                  <Muted className="text-xs">${activity.product.price.toFixed(2)}</Muted>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-2 border-t">
              {onLike && (
                <Button variant="ghost" size="sm" onClick={onLike}>
                  <Heart className="h-4 w-4 mr-2" />
                  {activity.likes || 0}
                </Button>
              )}
              {onComment && (
                <Button variant="ghost" size="sm" onClick={onComment}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {activity.comments || 0}
                </Button>
              )}
              {onShare && (
                <Button variant="ghost" size="sm" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeedCard;

