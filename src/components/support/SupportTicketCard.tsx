import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { P, Muted } from '@/components/ui/typography';
import { Clock, MessageSquare, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicketCardProps {
  ticket: {
    id: string;
    subject: string;
    category: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    createdAt: string;
    updatedAt: string;
    messages?: Array<{ id: string; content: string; createdAt: string }>;
  };
  onClick?: () => void;
}

const SupportTicketCard: React.FC<SupportTicketCardProps> = ({ ticket, onClick }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'open':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      open: 'default',
      'in-progress': 'secondary',
      resolved: 'default',
      closed: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      urgent: 'destructive',
      high: 'default',
      medium: 'secondary',
      low: 'outline',
    };
    return <Badge variant={variants[priority] || 'outline'}>{priority}</Badge>;
  };

  const lastMessage = ticket.messages && ticket.messages.length > 0 
    ? ticket.messages[ticket.messages.length - 1]
    : null;

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? '' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{ticket.subject}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
              <Badge variant="outline">{ticket.category}</Badge>
            </div>
          </div>
          <div className="ml-4">
            {getStatusIcon(ticket.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lastMessage && (
          <div className="space-y-2">
            <P className="text-sm line-clamp-2">{lastMessage.content}</P>
            <Muted className="text-xs">
              Last updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
            </Muted>
          </div>
        )}
        {!lastMessage && (
          <Muted className="text-xs">
            Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
          </Muted>
        )}
        {ticket.messages && ticket.messages.length > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>{ticket.messages.length} message{ticket.messages.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupportTicketCard;

