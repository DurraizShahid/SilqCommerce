import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Star, ShoppingBag } from 'lucide-react';

interface SocialProofBadgeProps {
  type: 'friends' | 'trending' | 'popular' | 'bestseller';
  count?: number;
  text?: string;
  className?: string;
}

const SocialProofBadge: React.FC<SocialProofBadgeProps> = ({
  type,
  count,
  text,
  className = '',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'friends':
        return <Users className="h-3 w-3" />;
      case 'trending':
        return <TrendingUp className="h-3 w-3" />;
      case 'popular':
        return <Star className="h-3 w-3" />;
      case 'bestseller':
        return <ShoppingBag className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'friends':
        return 'default';
      case 'trending':
        return 'secondary';
      case 'popular':
        return 'default';
      case 'bestseller':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getText = () => {
    if (text) return text;
    
    switch (type) {
      case 'friends':
        return count ? `${count} friends bought this` : 'Friends bought this';
      case 'trending':
        return count ? `Trending with ${count} views` : 'Trending';
      case 'popular':
        return count ? `${count} people viewing` : 'Popular';
      case 'bestseller':
        return count ? `${count} sold this week` : 'Bestseller';
      default:
        return '';
    }
  };

  return (
    <Badge variant={getVariant()} className={`flex items-center gap-1 ${className}`}>
      {getIcon()}
      <span>{getText()}</span>
    </Badge>
  );
};

export default SocialProofBadge;

