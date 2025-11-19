import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Instagram, Mail, Link2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  productName: string;
  productUrl: string;
  productImage?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  productName,
  productUrl,
  productImage,
}) => {
  const fullUrl = `${window.location.origin}${productUrl}`;
  const shareText = `Check out ${productName} on SilqCommerce!`;

  const handleShare = (platform: string) => {
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, show message
        toast.info('Copy the product link and share it on Instagram!');
        return;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(fullUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(fullUrl);
        toast.success('Link copied to clipboard!');
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('instagram')}>
          <Instagram className="h-4 w-4 mr-2" />
          Instagram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('copy')}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShareButtons;

