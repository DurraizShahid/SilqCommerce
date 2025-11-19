import React from 'react';
import { useNotifications } from '@/context/NotificationsContext';
import { H3, P, Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, X, Package, Tag, Bell, MessageSquare, Star, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onClose?: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-4 w-4" />;
      case 'product':
        return <Tag className="h-4 w-4" />;
      case 'promotion':
        return <Tag className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col max-h-[500px]">
      <div className="flex items-center justify-between p-4 border-b">
        <H3 className="text-lg font-semibold">Notifications</H3>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-muted-foreground">No notifications</P>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/50 transition-colors ${
                  !notification.read ? 'bg-muted/30' : ''
                }`}
              >
                <div className="flex gap-3">
                  <div className={`mt-1 ${!notification.read ? 'text-primary' : 'text-muted-foreground'}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    {notification.link ? (
                      <Link
                        to={notification.link}
                        onClick={() => handleNotificationClick(notification)}
                        className="block"
                      >
                        <P className={`font-semibold text-sm ${!notification.read ? '' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </P>
                        <Muted className="text-xs line-clamp-2 mt-1">
                          {notification.message}
                        </Muted>
                      </Link>
                    ) : (
                      <div onClick={() => handleNotificationClick(notification)}>
                        <P className={`font-semibold text-sm ${!notification.read ? '' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </P>
                        <Muted className="text-xs line-clamp-2 mt-1">
                          {notification.message}
                        </Muted>
                      </div>
                    )}
                    <Muted className="text-xs mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </Muted>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      {notifications.length > 0 && (
        <>
          <Separator />
          <div className="p-2">
            <Link to="/account/notifications">
              <Button variant="ghost" className="w-full" onClick={onClose}>
                View all notifications
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;

