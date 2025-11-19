import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Video,
  Send,
  Heart,
  Share2,
  ShoppingBag,
  Users,
  Radio,
  Smile,
  ThumbsUp,
  MessageCircle,
  Gift,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system' | 'purchase';
}

interface Reaction {
  id: string;
  type: 'heart' | 'thumbs-up' | 'smile';
  count: number;
}

interface FeaturedProduct {
  id: string;
  productId: string;
  highlighted: boolean;
}

const LiveEventPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([
    { id: 'r1', type: 'heart', count: 125 },
    { id: 'r2', type: 'thumbs-up', count: 89 },
    { id: 'r3', type: 'smile', count: 45 },
  ]);
  const [viewerCount, setViewerCount] = useState(1250);
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [activeTab, setActiveTab] = useState<'stream' | 'products' | 'info'>('stream');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock event data
  const event = {
    id: eventId || 'e1',
    title: 'Summer Collection Launch',
    description: 'Join us for an exclusive preview of our new summer collection',
    hostName: 'Emma Thompson',
    hostAvatar: '/api/placeholder/100/100',
    hostType: 'vendor',
    status: 'live',
    viewerCount: viewerCount,
    type: 'shopping',
    featuredProducts: products.slice(0, 4),
  };

  useEffect(() => {
    // Simulate live chat messages
    const interval = setInterval(() => {
      const messages = [
        'Love this collection!',
        'How much is that dress?',
        'Can we see it in different colors?',
        'Just purchased!',
        'Amazing quality!',
      ];
      const users = ['Sarah M.', 'John D.', 'Lisa K.', 'Mike T.', 'Anna B.'];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];

      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          userId: 'user-' + Math.random(),
          userName: randomUser,
          message: randomMessage,
          timestamp: new Date().toISOString(),
          type: Math.random() > 0.9 ? 'purchase' : 'message',
        },
      ]);
    }, 3000);

    // Simulate viewer count changes
    const viewerInterval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(viewerInterval);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatMessages([
      ...chatMessages,
      {
        id: `msg-${Date.now()}`,
        userId: 'current-user',
        userName: 'You',
        message: chatMessage,
        timestamp: new Date().toISOString(),
        type: 'message',
      },
    ]);
    setChatMessage('');
  };

  const handleReaction = (type: Reaction['type']) => {
    setReactions((prev) =>
      prev.map((r) => (r.type === type ? { ...r, count: r.count + 1 } : r))
    );
    toast.success(`Sent ${type} reaction!`);
  };

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    setChatMessages([
      ...chatMessages,
      {
        id: `msg-${Date.now()}`,
        userId: 'system',
        userName: 'System',
        message: `You purchased ${product.name}`,
        timestamp: new Date().toISOString(),
        type: 'purchase',
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H1 className="flex items-center gap-2">
            <Radio className="h-6 w-6 text-red-500 animate-pulse" />
            {event.title}
          </H1>
          <P className="text-muted-foreground">{event.description}</P>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500 animate-pulse">
            <Radio className="h-3 w-3 mr-1" />
            LIVE
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {viewerCount.toLocaleString()} watching
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Stream Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video Stream */}
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <P className="text-lg">Live Stream</P>
                  <Muted className="text-sm">Video player would be embedded here</Muted>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-2">
                  <Avatar className="h-8 w-8">
                    {event.hostAvatar ? (
                      <AvatarImage src={event.hostAvatar} alt={event.hostName} />
                    ) : null}
                    <AvatarFallback>{event.hostName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <P className="text-sm font-semibold text-white">{event.hostName}</P>
                    <Muted className="text-xs text-white/80">Host</Muted>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Reactions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4">
                {reactions.map((reaction) => (
                  <Button
                    key={reaction.id}
                    variant="outline"
                    size="lg"
                    onClick={() => handleReaction(reaction.type)}
                    className="flex flex-col gap-1"
                  >
                    {reaction.type === 'heart' && <Heart className="h-6 w-6 text-red-500" />}
                    {reaction.type === 'thumbs-up' && <ThumbsUp className="h-6 w-6 text-blue-500" />}
                    {reaction.type === 'smile' && <Smile className="h-6 w-6 text-yellow-500" />}
                    <span className="text-xs font-semibold">{reaction.count}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Featured Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {event.featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <img
                      src={product.images?.[0] || product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <P className="font-semibold text-sm line-clamp-2">{product.name}</P>
                      <P className="text-sm font-bold mt-1">{formatPrice(product.price)}</P>
                      <Button
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="h-3 w-3 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chat */}
        <div className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${
                      msg.type === 'purchase' ? 'bg-green-500/10 p-2 rounded' : ''
                    }`}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {msg.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{msg.userName}</span>
                        <Muted className="text-xs">
                          {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </Muted>
                      </div>
                      <P className="text-sm mt-0.5">{msg.message}</P>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Gift className="h-4 w-4 mr-2" />
                Send Gift
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View All Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveEventPage;

