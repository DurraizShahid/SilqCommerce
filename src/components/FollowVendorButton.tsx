import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface FollowVendorButtonProps {
  vendorId: string;
  vendorName: string;
}

const FollowVendorButton: React.FC<FollowVendorButtonProps> = ({ vendorId, vendorName }) => {
  const { isAuthenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Load followed vendors from localStorage
    const followed = JSON.parse(localStorage.getItem('followed_vendors') || '[]');
    setIsFollowing(followed.includes(vendorId));
  }, [vendorId]);

  const handleToggleFollow = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to follow vendors');
      return;
    }

    const followed = JSON.parse(localStorage.getItem('followed_vendors') || '[]');
    
    if (isFollowing) {
      const updated = followed.filter((id: string) => id !== vendorId);
      localStorage.setItem('followed_vendors', JSON.stringify(updated));
      setIsFollowing(false);
      toast.success(`Unfollowed ${vendorName}`);
    } else {
      const updated = [...followed, vendorId];
      localStorage.setItem('followed_vendors', JSON.stringify(updated));
      setIsFollowing(true);
      toast.success(`Following ${vendorName}`);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'default' : 'outline'}
      onClick={handleToggleFollow}
      className={isFollowing ? '' : 'border-primary text-primary hover:bg-primary/10'}
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4 mr-2" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
};

export default FollowVendorButton;

