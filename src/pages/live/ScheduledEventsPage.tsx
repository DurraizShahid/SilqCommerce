import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Bell, 
  Video,
  ShoppingBag,
  TrendingUp,
  Sparkles,
  Mic,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { toast } from 'sonner';

interface ScheduledEvent {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostType: 'vendor' | 'influencer' | 'stylist' | 'brand';
  startTime: string;
  endTime: string;
  type: 'shopping' | 'auction' | 'styling' | 'qna';
  category?: string;
  isReminderSet: boolean;
}

const ScheduledEventsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Mock scheduled events
  const scheduledEvents: ScheduledEvent[] = [
    {
      id: 'e1',
      title: 'Summer Collection Launch',
      description: 'Exclusive preview of new summer collection',
      hostName: 'Emma Thompson',
      hostType: 'vendor',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      type: 'shopping',
      category: 'Fashion',
      isReminderSet: false,
    },
    {
      id: 'e2',
      title: 'Luxury Handbag Auction',
      description: 'Rare designer handbags up for auction',
      hostName: 'Luxury Fashion House',
      hostType: 'brand',
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      type: 'auction',
      category: 'Accessories',
      isReminderSet: true,
    },
    {
      id: 'e3',
      title: 'Live Styling Session',
      description: 'Get personalized styling tips',
      hostName: 'Sophie Laurent',
      hostType: 'stylist',
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      type: 'styling',
      category: 'Styling',
      isReminderSet: false,
    },
    {
      id: 'e4',
      title: 'Q&A with Designers',
      description: 'Ask questions to featured designers',
      hostName: 'Design Team',
      hostType: 'vendor',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      type: 'qna',
      category: 'Fashion',
      isReminderSet: false,
    },
  ];

  const filteredEvents = useMemo(() => {
    if (typeFilter === 'all') return scheduledEvents;
    return scheduledEvents.filter(e => e.type === typeFilter);
  }, [typeFilter]);

  const eventsByDate = useMemo(() => {
    const grouped: Record<string, ScheduledEvent[]> = {};
    filteredEvents.forEach((event) => {
      const dateKey = format(new Date(event.startTime), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  const getEventsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  };

  const handleSetReminder = (eventId: string) => {
    toast.success('Reminder set! You\'ll be notified 15 minutes before the event.');
    // In real app, this would update the event state
  };

  const getTypeIcon = (type: ScheduledEvent['type']) => {
    switch (type) {
      case 'shopping':
        return <ShoppingBag className="h-4 w-4" />;
      case 'auction':
        return <TrendingUp className="h-4 w-4" />;
      case 'styling':
        return <Sparkles className="h-4 w-4" />;
      case 'qna':
        return <Mic className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <H1 className="flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-primary" />
            Scheduled Events
          </H1>
          <P className="text-muted-foreground">
            View and set reminders for upcoming live events
          </P>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">Calendar View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="auction">Auction</SelectItem>
              <SelectItem value="styling">Styling</SelectItem>
              <SelectItem value="qna">Q&A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{format(selectedDate, 'MMMM yyyy')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    hasEvents: (date) => getEventsForDate(date).length > 0,
                  }}
                  modifiersClassNames={{
                    hasEvents: 'bg-primary/10 border-primary',
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Events for Selected Date */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {format(selectedDate, 'EEEE, MMMM dd')}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <P className="text-muted-foreground">No events scheduled</P>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <Card key={event.id} className="border-primary/20">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(event.type)}
                              <P className="font-semibold text-sm">{event.title}</P>
                            </div>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                          <Muted className="text-xs mb-2 block">{event.hostName}</Muted>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(event.startTime), 'h:mm a')}</span>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/live/${event.id}`} className="flex-1">
                              <Button size="sm" variant="outline" className="w-full">
                                View Details
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant={event.isReminderSet ? 'default' : 'outline'}
                              onClick={() => handleSetReminder(event.id)}
                            >
                              <Bell className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(event.type)}
                      <P className="font-semibold text-lg">{event.title}</P>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <Muted className="mb-2 block">{event.description}</Muted>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(new Date(event.startTime), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(event.startTime), 'h:mm a')}</span>
                      </div>
                      <span>{event.hostName}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/live/${event.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    <Button
                      variant={event.isReminderSet ? 'default' : 'outline'}
                      onClick={() => handleSetReminder(event.id)}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      {event.isReminderSet ? 'Reminder Set' : 'Set Reminder'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledEventsPage;

