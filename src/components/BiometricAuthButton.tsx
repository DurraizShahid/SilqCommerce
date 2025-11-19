import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint, Eye, Mic } from 'lucide-react';
import { toast } from 'sonner';

interface BiometricAuthButtonProps {
  type?: 'fingerprint' | 'face' | 'voice';
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const BiometricAuthButton: React.FC<BiometricAuthButtonProps> = ({
  type = 'fingerprint',
  onSuccess,
  onError,
  className = '',
  size = 'default',
}) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    
    try {
      // Check if Web Authentication API is available
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication is not supported on this device');
      }

      // Placeholder for actual WebAuthn implementation
      // In production, this would use the Web Authentication API
      toast.info(`Authenticating with ${type}...`);

      // Simulate biometric authentication
      setTimeout(() => {
        // Mock successful authentication
        if (onSuccess) {
          onSuccess();
        }
        toast.success(`Successfully authenticated with ${type}`);
        setIsAuthenticating(false);
      }, 1500);
    } catch (error: any) {
      const errorMessage = error?.message || `Biometric authentication failed`;
      if (onError) {
        onError(errorMessage);
      }
      toast.error(errorMessage);
      setIsAuthenticating(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'fingerprint':
        return <Fingerprint className="h-5 w-5" />;
      case 'face':
        return <Eye className="h-5 w-5" />;
      case 'voice':
        return <Mic className="h-5 w-5" />;
      default:
        return <Fingerprint className="h-5 w-5" />;
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'fingerprint':
        return 'Use Fingerprint';
      case 'face':
        return 'Use Face ID';
      case 'voice':
        return 'Use Voice';
      default:
        return 'Biometric Login';
    }
  };

  return (
    <Button
      type="button"
      onClick={handleBiometricAuth}
      disabled={isAuthenticating}
      variant="outline"
      size={size}
      className={className}
    >
      {getIcon()}
      {size !== 'icon' && (
        <span className="ml-2">{isAuthenticating ? 'Authenticating...' : getLabel()}</span>
      )}
    </Button>
  );
};

export default BiometricAuthButton;

