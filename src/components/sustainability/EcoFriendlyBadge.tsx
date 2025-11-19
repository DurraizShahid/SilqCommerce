import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Leaf, Recycle, Droplets, Sun, Heart, Award } from 'lucide-react';

interface EcoFriendlyBadgeProps {
  type: 'eco-friendly' | 'organic' | 'recycled' | 'water-saving' | 'solar-powered' | 'fair-trade' | 'vegan' | 'cruelty-free';
  size?: 'sm' | 'md' | 'lg';
}

const EcoFriendlyBadge: React.FC<EcoFriendlyBadgeProps> = ({ type, size = 'md' }) => {
  const getIcon = () => {
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    switch (type) {
      case 'eco-friendly':
        return <Leaf className={iconSize} />;
      case 'organic':
        return <Leaf className={iconSize} />;
      case 'recycled':
        return <Recycle className={iconSize} />;
      case 'water-saving':
        return <Droplets className={iconSize} />;
      case 'solar-powered':
        return <Sun className={iconSize} />;
      case 'fair-trade':
        return <Award className={iconSize} />;
      case 'vegan':
        return <Leaf className={iconSize} />;
      case 'cruelty-free':
        return <Heart className={iconSize} />;
      default:
        return <Leaf className={iconSize} />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'eco-friendly':
        return 'Eco-Friendly';
      case 'organic':
        return 'Organic';
      case 'recycled':
        return 'Recycled';
      case 'water-saving':
        return 'Water-Saving';
      case 'solar-powered':
        return 'Solar-Powered';
      case 'fair-trade':
        return 'Fair Trade';
      case 'vegan':
        return 'Vegan';
      case 'cruelty-free':
        return 'Cruelty-Free';
      default:
        return 'Eco-Friendly';
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'eco-friendly':
      case 'organic':
      case 'vegan':
        return 'default';
      case 'fair-trade':
        return 'secondary';
      case 'recycled':
      case 'water-saving':
      case 'solar-powered':
        return 'outline';
      case 'cruelty-free':
        return 'default';
      default:
        return 'outline';
    }
  };

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-1';

  return (
    <Badge variant={getVariant()} className={`flex items-center gap-1 ${sizeClass} bg-green-500/10 text-green-700 border-green-500/20`}>
      {getIcon()}
      {getLabel()}
    </Badge>
  );
};

export default EcoFriendlyBadge;

