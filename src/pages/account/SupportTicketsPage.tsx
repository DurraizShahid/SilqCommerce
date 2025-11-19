import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supportTickets } from '@/data/dummyData';
import { MessageSquare, Plus, Send, Paperclip, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SupportTicketCard from '@/components/support/SupportTicketCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const SupportTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState(supportTickets);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<typeof supportTickets[0] | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'other' as const,
    priority: 'medium' as const,
    message: '',
  });

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const ticketStats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in-progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      closed: tickets.filter(t => t.status === 'closed').length,
    };
  }, [tickets]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'resolved':
        return 'default';
      case 'closed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ticket: typeof supportTickets[0] = {
      id: `ticket-${Date.now()}`,
      customerId: 'customer1',
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: `ticket-${Date.now()}`,
          senderId: 'customer1',
          senderName: 'You',
          senderType: 'customer',
          content: newTicket.message,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTickets([ticket, ...tickets]);
    toast.success('Support ticket created successfully');
    setIsCreateDialogOpen(false);
    setNewTicket({ subject: '', category: 'other', priority: 'medium', message: '' });
  };

  const handleViewTicket = (ticket: typeof supportTickets[0]) => {
    setSelectedTicket(ticket);
    setIsViewDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message = {
      id: `msg-${Date.now()}`,
      ticketId: selectedTicket.id,
      senderId: 'customer1',
      senderName: 'You',
      senderType: 'customer' as const,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              messages: [...t.messages, message],
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, message],
      updatedAt: new Date().toISOString(),
    });

    setNewMessage('');
    toast.success('Message sent');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Support Tickets</H1>
          <P className="text-muted-foreground">Get help with your orders and account</P>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ticketStats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{ticketStats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{ticketStats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{ticketStats.closed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets */}
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-4">You don't have any support tickets.</P>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Create Ticket</Button>
          </CardContent>
        </Card>
      ) : filteredTickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <P className="text-muted-foreground">No tickets found matching your filters.</P>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Tickets ({filteredTickets.length})</TabsTrigger>
            <TabsTrigger value="open">Open ({ticketStats.open})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({ticketStats.inProgress})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({ticketStats.resolved})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredTickets.map((ticket) => (
              <SupportTicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => handleViewTicket(ticket)}
              />
            ))}
          </TabsContent>

          <TabsContent value="open" className="space-y-4">
            {filteredTickets.filter(t => t.status === 'open').map((ticket) => (
              <SupportTicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => handleViewTicket(ticket)}
              />
            ))}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {filteredTickets.filter(t => t.status === 'in-progress').map((ticket) => (
              <SupportTicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => handleViewTicket(ticket)}
              />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            {filteredTickets.filter(t => t.status === 'resolved').map((ticket) => (
              <SupportTicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => handleViewTicket(ticket)}
              />
            ))}
          </TabsContent>
        </Tabs>
      )}

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>Describe your issue and we'll help you resolve it</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) => setNewTicket({ ...newTicket, category: value as typeof newTicket.category })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as typeof newTicket.priority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Please provide details about your issue..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.subject}</DialogTitle>
            <DialogDescription>
              <div className="flex gap-2 mt-2">
                <Badge variant={getStatusColor(selectedTicket?.status || 'open')}>
                  {selectedTicket?.status.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge variant={getPriorityColor(selectedTicket?.priority || 'medium')}>
                  {selectedTicket?.priority.toUpperCase()}
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {selectedTicket?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.senderType === 'customer' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.senderType !== 'customer' && (
                    <Avatar>
                      <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col max-w-[80%] ${
                      message.senderType === 'customer' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <P className="text-sm font-semibold">{message.senderName}</P>
                      <Muted className="text-xs">
                        {new Date(message.createdAt).toLocaleString()}
                      </Muted>
                    </div>
                    <div
                      className={`rounded-lg p-4 ${
                        message.senderType === 'customer'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <P className="text-sm whitespace-pre-wrap">{message.content}</P>
                    </div>
                  </div>
                  {message.senderType === 'customer' && (
                    <Avatar>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Reply</Label>
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={3}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTicketsPage;

