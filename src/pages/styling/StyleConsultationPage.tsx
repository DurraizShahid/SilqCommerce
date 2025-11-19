import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  Star, 
  Video, 
  MapPin, 
  DollarSign,
  CheckCircle,
  XCircle,
  Plus,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useCurrency } from '@/context/CurrencyContext';

interface Stylist {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  rating: number;
  reviews: number;
  specialties: string[];
  price: number;
  available: boolean;
  location?: string;
}

interface Consultation {
  id: string;
  stylistId: string;
  stylistName: string;
  type: 'virtual' | 'in-person';
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
}

const StyleConsultationPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'book' | 'upcoming' | 'past'>('book');
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [consultationType, setConsultationType] = useState<'virtual' | 'in-person'>('virtual');
  const [bookingNotes, setBookingNotes] = useState('');

  const stylists: Stylist[] = [
    {
      id: 's1',
      name: 'Emma Thompson',
      title: 'Senior Personal Stylist',
      rating: 4.9,
      reviews: 127,
      specialties: ['Luxury Fashion', 'Wardrobe Planning', 'Color Analysis'],
      price: 150,
      available: true,
      location: 'New York, NY',
    },
    {
      id: 's2',
      name: 'Michael Chen',
      title: 'Celebrity Stylist',
      rating: 5.0,
      reviews: 89,
      specialties: ['Red Carpet', 'Formal Events', 'Editorial'],
      price: 250,
      available: true,
      location: 'Los Angeles, CA',
    },
    {
      id: 's3',
      name: 'Sophie Laurent',
      title: 'Fashion Consultant',
      rating: 4.8,
      reviews: 203,
      specialties: ['Sustainable Fashion', 'Capsule Wardrobe', 'Body Type'],
      price: 120,
      available: true,
      location: 'Paris, France',
    },
  ];

  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: 'c1',
      stylistId: 's1',
      stylistName: 'Emma Thompson',
      type: 'virtual',
      date: '2023-12-15',
      time: '14:00',
      status: 'upcoming',
      price: 150,
      notes: 'Need help with winter wardrobe',
    },
    {
      id: 'c2',
      stylistId: 's2',
      stylistName: 'Michael Chen',
      type: 'in-person',
      date: '2023-11-20',
      time: '10:00',
      status: 'completed',
      price: 250,
      notes: 'Event styling consultation',
    },
  ]);

  const handleBookConsultation = () => {
    if (!selectedStylist || !bookingDate || !bookingTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newConsultation: Consultation = {
      id: `c-${Date.now()}`,
      stylistId: selectedStylist.id,
      stylistName: selectedStylist.name,
      type: consultationType,
      date: bookingDate,
      time: bookingTime,
      status: 'upcoming',
      price: selectedStylist.price,
      notes: bookingNotes,
    };

    setConsultations([...consultations, newConsultation]);
    setIsBookingDialogOpen(false);
    setSelectedStylist(null);
    setBookingDate('');
    setBookingTime('');
    setBookingNotes('');
    toast.success('Consultation booked successfully!');
  };

  const handleCancelConsultation = (consultationId: string) => {
    setConsultations(consultations.map(c =>
      c.id === consultationId ? { ...c, status: 'cancelled' as const } : c
    ));
    toast.success('Consultation cancelled');
  };

  const upcomingConsultations = consultations.filter(c => c.status === 'upcoming');
  const pastConsultations = consultations.filter(c => c.status === 'completed' || c.status === 'cancelled');

  return (
    <div className="space-y-8">
      <div>
        <H1>Style Consultation</H1>
        <P className="text-muted-foreground">Book a session with our professional stylists</P>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList>
          <TabsTrigger value="book">Book Consultation</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingConsultations.length})</TabsTrigger>
          <TabsTrigger value="past">Past Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          <div>
            <H1 className="text-2xl mb-2">Available Stylists</H1>
            <P className="text-muted-foreground">Choose a stylist that matches your needs</P>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stylists.map((stylist) => (
              <Card key={stylist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      {stylist.avatar ? (
                        <AvatarImage src={stylist.avatar} alt={stylist.name} />
                      ) : null}
                      <AvatarFallback>{stylist.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{stylist.name}</CardTitle>
                      <CardDescription className="mt-1">{stylist.title}</CardDescription>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{stylist.rating}</span>
                        <Muted className="text-xs">({stylist.reviews} reviews)</Muted>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stylist.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{stylist.location}</span>
                    </div>
                  )}
                  <div>
                    <P className="text-sm font-semibold mb-2">Specialties</P>
                    <div className="flex flex-wrap gap-1">
                      {stylist.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <P className="text-2xl font-bold">{formatPrice(stylist.price)}</P>
                      <Muted className="text-xs">per session</Muted>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedStylist(stylist);
                        setIsBookingDialogOpen(true);
                      }}
                      disabled={!stylist.available}
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingConsultations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-lg text-muted-foreground">No upcoming consultations</P>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingConsultations.map((consultation) => (
                <Card key={consultation.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <P className="font-semibold text-lg">{consultation.stylistName}</P>
                          <Badge variant="default">Upcoming</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(consultation.date), 'MMMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{consultation.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {consultation.type === 'virtual' ? (
                              <Video className="h-4 w-4" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                            <span className="capitalize">{consultation.type} Consultation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatPrice(consultation.price)}</span>
                          </div>
                          {consultation.notes && (
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 mt-0.5" />
                              <span>{consultation.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleCancelConsultation(consultation.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastConsultations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-lg text-muted-foreground">No past consultations</P>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastConsultations.map((consultation) => (
                <Card key={consultation.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <P className="font-semibold text-lg">{consultation.stylistName}</P>
                          <Badge variant={consultation.status === 'completed' ? 'default' : 'destructive'}>
                            {consultation.status === 'completed' ? 'Completed' : 'Cancelled'}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(consultation.date), 'MMMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatPrice(consultation.price)}</span>
                          </div>
                        </div>
                      </div>
                      {consultation.status === 'completed' && (
                        <Button variant="outline">
                          <Star className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Consultation with {selectedStylist?.name}</DialogTitle>
            <DialogDescription>
              Schedule your style consultation session
            </DialogDescription>
          </DialogHeader>
          {selectedStylist && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <P className="font-semibold">{selectedStylist.name}</P>
                  <P className="text-2xl font-bold">{formatPrice(selectedStylist.price)}</P>
                </div>
                <Muted className="text-sm">{selectedStylist.title}</Muted>
              </div>

              <div className="space-y-2">
                <Label>Consultation Type</Label>
                <Select value={consultationType} onValueChange={(value: any) => setConsultationType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual (Video Call)</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bookingDate">Date *</Label>
                  <Input
                    id="bookingDate"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bookingTime">Time *</Label>
                  <Input
                    id="bookingTime"
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bookingNotes">Notes (Optional)</Label>
                <Textarea
                  id="bookingNotes"
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Tell your stylist about your style goals, occasions, or specific needs..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookConsultation}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StyleConsultationPage;

