import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Book, MessageCircle, FileText, Video, Phone, Mail, HelpCircle, TrendingUp, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HelpArticleCard from '@/components/support/HelpArticleCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  views: number;
}

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'orders', name: 'Orders & Shipping', icon: FileText },
    { id: 'returns', name: 'Returns & Refunds', icon: MessageCircle },
    { id: 'account', name: 'Account & Settings', icon: Book },
    { id: 'payment', name: 'Payment & Billing', icon: FileText },
    { id: 'products', name: 'Products & Catalog', icon: Book },
  ];

  const faqs: FAQ[] = [
    {
      id: 'faq1',
      question: 'How do I track my order?',
      answer: 'You can track your order by visiting your account dashboard and clicking on "Order History". From there, select the order you want to track and click "Track Order" to see real-time updates.',
      category: 'orders',
    },
    {
      id: 'faq2',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some items like personalized products may not be eligible for return.',
      category: 'returns',
    },
    {
      id: 'faq3',
      question: 'How do I change my password?',
      answer: 'Go to your account settings, click on "Security", and then "Change Password". Enter your current password and your new password twice to confirm.',
      category: 'account',
    },
    {
      id: 'faq4',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, Amex), digital wallets (Apple Pay, Google Pay), and buy now pay later options (Klarna, Afterpay).',
      category: 'payment',
    },
    {
      id: 'faq5',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping may take 7-14 business days depending on the destination.',
      category: 'orders',
    },
    {
      id: 'faq6',
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within 1 hour of placing it. After that, you\'ll need to wait for the order to arrive and then initiate a return.',
      category: 'orders',
    },
  ];

  const articles: HelpArticle[] = [
    {
      id: 'art1',
      title: 'Getting Started: Your First Order',
      content: 'Learn how to place your first order, navigate the checkout process, and track your shipment.',
      category: 'orders',
      views: 1234,
      lastUpdated: '2023-11-01',
      readTime: 5,
    },
    {
      id: 'art2',
      title: 'Understanding Product Variations',
      content: 'Learn about different product options like size, color, and material variations.',
      category: 'products',
      views: 856,
      lastUpdated: '2023-10-28',
      readTime: 3,
    },
    {
      id: 'art3',
      title: 'Managing Your Account',
      content: 'Complete guide to managing your account settings, preferences, and saved information.',
      category: 'account',
      views: 642,
      lastUpdated: '2023-10-25',
      readTime: 7,
    },
    {
      id: 'art4',
      title: 'Payment Methods & Security',
      content: 'Learn about accepted payment methods, security features, and how to manage your payment options.',
      category: 'payment',
      views: 523,
      lastUpdated: '2023-11-05',
      readTime: 4,
    },
    {
      id: 'art5',
      title: 'Returns & Refunds Guide',
      content: 'Complete guide to returning items, processing refunds, and understanding our return policy.',
      category: 'returns',
      views: 789,
      lastUpdated: '2023-11-08',
      readTime: 6,
    },
    {
      id: 'art6',
      title: 'Shipping & Delivery Options',
      content: 'Learn about shipping methods, delivery times, and tracking your packages.',
      category: 'orders',
      views: 945,
      lastUpdated: '2023-11-10',
      readTime: 5,
    },
  ];

  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);

  const popularArticles = useMemo(() => {
    return [...articles].sort((a, b) => b.views - a.views).slice(0, 3);
  }, [articles]);

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <H1>Help Center</H1>
        <P className="text-muted-foreground">
          Find answers to common questions and get support
        </P>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/support/chat">
            <CardContent className="pt-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-lg">Live Chat</CardTitle>
              <Muted className="text-sm">Chat with our support team</Muted>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/account/support-tickets">
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-lg">Support Tickets</CardTitle>
              <Muted className="text-sm">Create and track tickets</Muted>
            </CardContent>
          </Link>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-lg">Phone Support</CardTitle>
            <Muted className="text-sm">1-800-LUXURY</Muted>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-lg">Email Support</CardTitle>
            <Muted className="text-sm">support@luxurystore.com</Muted>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div>
        <H1 className="text-xl mb-4">Browse by Category</H1>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedCategory === category.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="pt-6 text-center">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <P className="text-sm font-medium">{category.name}</P>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div>
        <H1 className="text-xl mb-4">Frequently Asked Questions</H1>
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <P className="text-muted-foreground">{faq.answer}</P>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <P className="text-muted-foreground">No FAQs found matching your search.</P>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for FAQs and Articles */}
      <Tabs defaultValue="faqs" className="w-full">
        <TabsList>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="articles">Help Articles</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <P className="text-muted-foreground">{faq.answer}</P>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <P className="text-muted-foreground">No FAQs found matching your search.</P>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="space-y-6">
          <div>
            <H1 className="text-xl mb-4">Help Articles</H1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <HelpArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => {
                    setSelectedArticle(article);
                    setIsArticleDialogOpen(true);
                  }}
                />
              ))}
            </div>
            {filteredArticles.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <P className="text-muted-foreground">No articles found matching your search.</P>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <H1 className="text-xl">Popular Articles</H1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {popularArticles.map((article) => (
                <HelpArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => {
                    setSelectedArticle(article);
                    setIsArticleDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Article Detail Dialog */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{selectedArticle?.category}</Badge>
                <Muted className="text-xs">
                  {selectedArticle?.views} views • {selectedArticle?.readTime} min read
                </Muted>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <P className="text-muted-foreground">{selectedArticle?.content}</P>
            <div className="p-4 bg-muted rounded-lg">
              <P className="font-semibold mb-2">Full Article Content</P>
              <P className="text-sm text-muted-foreground">
                This is a detailed guide covering all aspects of {selectedArticle?.title.toLowerCase()}. 
                In a real implementation, this would contain the full article content with sections, 
                step-by-step instructions, images, and more.
              </P>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t">
              <Star className="h-4 w-4 text-yellow-500" />
              <P className="text-sm">Was this article helpful?</P>
              <div className="flex gap-2 ml-auto">
                <Button variant="outline" size="sm">Yes</Button>
                <Button variant="outline" size="sm">No</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpCenterPage;

