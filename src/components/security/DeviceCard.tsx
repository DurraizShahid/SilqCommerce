import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { P, Muted } from '@/components/ui/typography';
import { Smartphone, Monitor, Tablet, Laptop, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface DeviceCardProps {
  device: {
    id: string;
    name: string;
    type: 'mobile' | 'desktop' | 'tablet' | 'laptop';
    os: string;
    browser: string;
    ipAddress: string;
    location?: string;
    lastActive: string;
    isCurrent: boolean;
    isTrusted: boolean;
  };
  onRemove?: () => void;
  onTrust?: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onRemove, onTrust }) => {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />;
      case 'desktop':
        return <Monitor className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      case 'laptop':
        return <Laptop className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  return (
    <Card className={`hover:shadow-sm transition-shadow ${device.isCurrent ? 'border-primary' : ''}`}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              {getDeviceIcon(device.type)}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <P className="font-semibold">{device.name}</P>
                {device.isCurrent && (
                  <Badge variant="default" className="text-xs">Current Device</Badge>
                )}
                {device.isTrusted && (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Trusted
                  </Badge>
                )}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>{device.os} • {device.browser}</div>
                <div className="flex items-center gap-2">
                  <span>{device.ipAddress}</span>
                  {device.location && (
                    <>
                      <span>•</span>
                      <span>{device.location}</span>
                    </>
                  )}
                </div>
                <Muted className="text-xs">
                  Last active: {format(new Date(device.lastActive), 'MMM dd, yyyy HH:mm')}
                </Muted>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {!device.isCurrent && (
              <>
                {!device.isTrusted && onTrust && (
                  <Button variant="outline" size="sm" onClick={onTrust}>
                    Trust
                  </Button>
                )}
                {onRemove && (
                  <Button variant="ghost" size="sm" onClick={onRemove} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;

