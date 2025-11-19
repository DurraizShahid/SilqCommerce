import React from 'react';
import { Button } from '@/components/ui/button';
import { Chrome, Apple, Facebook, Instagram, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

interface SocialLoginButtonsProps {
  onSuccess?: (provider: string, data: any) => void;
  onError?: (error: string) => void;
  compact?: boolean;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onSuccess,
  onError,
  compact = false,
}) => {
  const handleSocialLogin = async (provider: string) => {
    try {
      // Placeholder for actual OAuth integration
      // In production, this would redirect to OAuth provider or use SDK
      toast.info(`Connecting to ${provider}...`);
      
      // Simulate OAuth flow
      setTimeout(() => {
        // Mock successful login
        const mockUserData = {
          provider,
          email: `user@${provider.toLowerCase()}.com`,
          name: 'Social User',
          id: `social_${Date.now()}`,
        };
        
        if (onSuccess) {
          onSuccess(provider, mockUserData);
        } else {
          toast.success(`Successfully connected with ${provider}`);
        }
      }, 1000);
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to connect with ${provider}`;
      if (onError) {
        onError(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const providers = compact
    ? [
        {
          name: 'Google',
          icon: Chrome,
          color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
          handler: () => handleSocialLogin('Google'),
        },
        {
          name: 'Apple',
          icon: Apple,
          color: 'bg-black hover:bg-gray-900 text-white',
          handler: () => handleSocialLogin('Apple'),
        },
        {
          name: 'Facebook',
          icon: Facebook,
          color: 'bg-[#1877F2] hover:bg-[#166FE5] text-white',
          handler: () => handleSocialLogin('Facebook'),
        },
      ]
    : [
        {
          name: 'Google',
          icon: Chrome,
          color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
          handler: () => handleSocialLogin('Google'),
        },
        {
          name: 'Apple',
          icon: Apple,
          color: 'bg-black hover:bg-gray-900 text-white',
          handler: () => handleSocialLogin('Apple'),
        },
        {
          name: 'Facebook',
          icon: Facebook,
          color: 'bg-[#1877F2] hover:bg-[#166FE5] text-white',
          handler: () => handleSocialLogin('Facebook'),
        },
        {
          name: 'Instagram',
          icon: Instagram,
          color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
          handler: () => handleSocialLogin('Instagram'),
        },
        {
          name: 'LinkedIn',
          icon: Linkedin,
          color: 'bg-[#0077B5] hover:bg-[#006399] text-white',
          handler: () => handleSocialLogin('LinkedIn'),
        },
      ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      {compact ? (
        <div className="grid grid-cols-3 gap-3">
          {providers.map((provider) => {
            const Icon = provider.icon;
            return (
              <Button
                key={provider.name}
                type="button"
                onClick={provider.handler}
                className={`w-full ${provider.color} transition-colors`}
                variant="outline"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">{provider.name}</span>
              </Button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {providers.map((provider) => {
            const Icon = provider.icon;
            return (
              <Button
                key={provider.name}
                type="button"
                onClick={provider.handler}
                className={`w-full ${provider.color} transition-colors`}
                variant="outline"
              >
                <Icon className="h-5 w-5 mr-2" />
                Continue with {provider.name}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SocialLoginButtons;

