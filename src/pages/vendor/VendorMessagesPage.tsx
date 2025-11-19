import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Send, Paperclip } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface Message {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  orderId?: string;
}

interface ConversationMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'vendor';
  message: string;
  timestamp: string;
  attachments?: string[];
}

const VendorMessagesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const conversations: Message[] = [
    {
      id: 'conv1',
      customerId: 'c1',
      customerName: 'Sarah Johnson',
      lastMessage: 'Thank you for the quick shipping!',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 0,
      orderId: 'ord123',
    },
    {
      id: 'conv2',
      customerId: 'c2',
      customerName: 'Michael Chen',
      lastMessage: 'When will my order arrive?',
      lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
      unreadCount: 2,
      orderId: 'ord124',
    },
    {
      id: 'conv3',
      customerId: 'c3',
      customerName: 'Emily Davis',
      lastMessage: 'I love the product quality!',
      lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
      unreadCount: 0,
    },
  ];

  const messages: Record<string, ConversationMessage[]> = {
    conv1: [
      {
        id: 'm1',
        senderId: 'c1',
        senderName: 'Sarah Johnson',
        senderType: 'customer',
        message: 'Hello, I have a question about my order.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'm2',
        senderId: 'v1',
        senderName: 'You',
        senderType: 'vendor',
        message: 'Hi Sarah! How can I help you today?',
        timestamp: new Date(Date.now() - 86300000).toISOString(),
      },
      {
        id: 'm3',
        senderId: 'c1',
        senderName: 'Sarah Johnson',
        senderType: 'customer',
        message: 'Thank you for the quick shipping!',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
    conv2: [
      {
        id: 'm4',
        senderId: 'c2',
        senderName: 'Michael Chen',
        senderType: 'customer',
        message: 'When will my order arrive?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
    conv3: [
      {
        id: 'm5',
        senderId: 'c3',
        senderName: 'Emily Davis',
        senderType: 'customer',
        message: 'I love the product quality!',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];
  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    // In real app, this would send to backend
    toast.success('Message sent!');
    setMessageInput('');
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Messages</H1>
        <P className="text-muted-foreground">Communicate with your customers</P>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="divide-y">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {conversation.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <P className="font-semibold text-sm truncate">
                            {conversation.customerName}
                          </P>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default">{conversation.unreadCount}</Badge>
                          )}
                        </div>
                        <Muted className="text-xs line-clamp-1">
                          {conversation.lastMessage}
                        </Muted>
                        <Muted className="text-xs mt-1 block">
                          {formatDistanceToNow(new Date(conversation.lastMessageTime), { addSuffix: true })}
                        </Muted>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedConv?.customerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedConv?.customerName}</CardTitle>
                      {selectedConv?.orderId && (
                        <Muted className="text-xs">Order #{selectedConv.orderId}</Muted>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {currentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === 'vendor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderType === 'vendor'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <P className="text-xs font-semibold mb-1">{message.senderName}</P>
                          <P className="text-sm">{message.message}</P>
                          <Muted className={`text-xs mt-1 block ${message.senderType === 'vendor' ? 'text-primary-foreground/70' : ''}`}>
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </Muted>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-muted-foreground">Select a conversation to start messaging</P>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VendorMessagesPage;

