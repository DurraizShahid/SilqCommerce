import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Book, 
  Code, 
  Key, 
  Webhook,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  auth: 'API Key' | 'OAuth' | 'Bearer Token';
  parameters?: { name: string; type: string; required: boolean; description: string }[];
  example?: string;
}

const APIDocumentationPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const endpoints: Record<string, APIEndpoint[]> = {
    'Products': [
      {
        method: 'GET',
        path: '/api/v1/products',
        description: 'List all products with pagination and filters',
        auth: 'API Key',
        parameters: [
          { name: 'page', type: 'integer', required: false, description: 'Page number' },
          { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
          { name: 'category', type: 'string', required: false, description: 'Filter by category' },
          { name: 'minPrice', type: 'number', required: false, description: 'Minimum price' },
          { name: 'maxPrice', type: 'number', required: false, description: 'Maximum price' },
        ],
        example: `curl -X GET "https://api.luxurystore.com/v1/products?page=1&limit=20&category=Dresses" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      },
      {
        method: 'GET',
        path: '/api/v1/products/{id}',
        description: 'Get product details by ID',
        auth: 'API Key',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Product ID' },
        ],
        example: `curl -X GET "https://api.luxurystore.com/v1/products/prod123" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      },
      {
        method: 'POST',
        path: '/api/v1/products',
        description: 'Create a new product',
        auth: 'OAuth',
        example: `curl -X POST "https://api.luxurystore.com/v1/products" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Luxury Dress",
    "description": "Elegant evening dress",
    "price": 599.99,
    "category": "Dresses",
    "stock": 10
  }'`,
      },
    ],
    'Orders': [
      {
        method: 'GET',
        path: '/api/v1/orders',
        description: 'List orders with filters',
        auth: 'API Key',
        parameters: [
          { name: 'status', type: 'string', required: false, description: 'Order status filter' },
          { name: 'from', type: 'date', required: false, description: 'Start date' },
          { name: 'to', type: 'date', required: false, description: 'End date' },
        ],
        example: `curl -X GET "https://api.luxurystore.com/v1/orders?status=pending" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      },
      {
        method: 'GET',
        path: '/api/v1/orders/{id}',
        description: 'Get order details',
        auth: 'API Key',
        example: `curl -X GET "https://api.luxurystore.com/v1/orders/ord123" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      },
    ],
    'Webhooks': [
      {
        method: 'POST',
        path: '/api/v1/webhooks',
        description: 'Create a new webhook',
        auth: 'OAuth',
        example: `curl -X POST "https://api.luxurystore.com/v1/webhooks" \\
  -H "Authorization: Bearer YOUR_OAUTH_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://your-app.com/webhook",
    "events": ["order.created", "order.updated"],
    "secret": "your_webhook_secret"
  }'`,
      },
      {
        method: 'GET',
        path: '/api/v1/webhooks',
        description: 'List all webhooks',
        auth: 'API Key',
        example: `curl -X GET "https://api.luxurystore.com/v1/webhooks" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      },
    ],
  };

  const handleCopyCode = (code: string, endpoint: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(endpoint);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      case 'PATCH': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <H1 className="flex items-center gap-2">
          <Book className="h-8 w-8 text-primary" />
          API Documentation
        </H1>
        <P className="text-muted-foreground">
          Complete API reference for developers
        </P>
      </div>

      {/* Quick Start */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get started with our API in minutes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <P className="font-semibold">1. Get Your API Key</P>
            <Muted className="text-sm">
              Navigate to API Keys section to generate your authentication key
            </Muted>
          </div>
          <div className="space-y-2">
            <P className="font-semibold">2. Base URL</P>
            <code className="block p-2 bg-background rounded border text-sm">
              https://api.luxurystore.com/v1
            </code>
          </div>
          <div className="space-y-2">
            <P className="font-semibold">3. Authentication</P>
            <code className="block p-2 bg-background rounded border text-sm">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download SDK
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Postman Collection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Tabs defaultValue="Products" className="space-y-6">
        <TabsList>
          {Object.keys(endpoints).map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(endpoints).map(([category, categoryEndpoints]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {categoryEndpoints.map((endpoint, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{endpoint.auth}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <div>
                      <P className="font-semibold mb-2">Parameters</P>
                      <div className="space-y-2">
                        {endpoint.parameters.map((param, paramIndex) => (
                          <div key={paramIndex} className="flex items-start gap-3 p-2 bg-muted rounded">
                            <div className="flex-1">
                              <code className="text-sm font-semibold">{param.name}</code>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {param.type}
                              </Badge>
                              {param.required && (
                                <Badge variant="destructive" className="ml-2 text-xs">
                                  Required
                                </Badge>
                              )}
                              <Muted className="text-xs block mt-1">{param.description}</Muted>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {endpoint.example && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <P className="font-semibold">Example Request</P>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(endpoint.example!, `${endpoint.method}-${endpoint.path}`)}
                        >
                          {copiedCode === `${endpoint.method}-${endpoint.path}` ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                        <code>{endpoint.example}</code>
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Rate Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limits</CardTitle>
          <CardDescription>API usage limits and quotas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <P className="font-semibold mb-1">Free Tier</P>
              <P className="text-2xl font-bold">1,000</P>
              <Muted className="text-xs">requests per day</Muted>
            </div>
            <div className="p-4 border rounded-lg">
              <P className="font-semibold mb-1">Pro Tier</P>
              <P className="text-2xl font-bold">10,000</P>
              <Muted className="text-xs">requests per day</Muted>
            </div>
            <div className="p-4 border rounded-lg">
              <P className="font-semibold mb-1">Enterprise</P>
              <P className="text-2xl font-bold">Unlimited</P>
              <Muted className="text-xs">requests per day</Muted>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SDKs */}
      <Card>
        <CardHeader>
          <CardTitle>SDKs & Libraries</CardTitle>
          <CardDescription>Official SDKs for popular languages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {['JavaScript', 'Python', 'PHP', 'Ruby', 'Java', 'Go'].map((lang) => (
              <Card key={lang} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <P className="font-semibold">{lang}</P>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  <Muted className="text-xs block mt-2">v1.2.0</Muted>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIDocumentationPage;

