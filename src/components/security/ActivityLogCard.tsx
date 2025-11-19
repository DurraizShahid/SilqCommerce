import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { P, Muted } from '@/components/ui/typography';
import { Shield, Smartphone, Globe, AlertTriangle, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityLogCardProps {
  activity: {
    id: string;
    type: 'login' | 'logout' | 'password_change' | 'mfa_enabled' | 'mfa_disabled' | 'device_added' | 'device_removed' | 'suspicious_activity' | 'security_update';
    description: string;
    ipAddress: string;
    location?: string;
    device?: string;
    browser?: string;
    timestamp: string;
    status: 'success' | 'failed' | 'warning';
  };
}

const ActivityLogCard: React.FC<ActivityLogCardProps> = ({ activity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'logout':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'password_change':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'mfa_enabled':
      case 'mfa_disabled':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'device_added':
      case 'device_removed':
        return <Smartphone className="h-4 w-4 text-orange-600" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      success: 'default',
      failed: 'destructive',
      warning: 'secondary',
    };
    return <Badge variant={variants[status] || 'outline'} className="text-xs">{status}</Badge>;
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <P className="text-sm font-medium">{activity.description}</P>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {getStatusBadge(activity.status)}
                  <Muted className="text-xs">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </Muted>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              {activity.ipAddress && (
                <div className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  <span>{activity.ipAddress}</span>
                </div>
              )}
              {activity.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{activity.location}</span>
                </div>
              )}
              {activity.device && (
                <span>{activity.device}</span>
              )}
              {activity.browser && (
                <span>• {activity.browser}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogCard;

