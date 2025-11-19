import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Copy, Key, Webhook, FileText, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
}

const AdminAPIManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks'>('keys');
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: 'key1',
      name: 'Vendor Integration',
      key: 'sk_live_abc123def456ghi789',
      permissions: ['read:products', 'write:products', 'read:orders'],
      createdAt: '2023-10-15',
      lastUsed: '2023-11-28T10:30:00Z',
      isActive: true,
    },
    {
      id: 'key2',
      name: 'Analytics Dashboard',
      key: 'sk_live_xyz789abc123def456',
      permissions: ['read:analytics', 'read:reports'],
      createdAt: '2023-11-01',
      isActive: true,
    },
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 'wh1',
      name: 'Order Notifications',
      url: 'https://vendor.example.com/webhooks/orders',
      events: ['order.created', 'order.updated', 'order.cancelled'],
      secret: 'whsec_abc123',
      isActive: true,
      createdAt: '2023-10-20',
      lastTriggered: '2023-11-28T09:15:00Z',
    },
    {
      id: 'wh2',
      name: 'Product Updates',
      url: 'https://crm.example.com/webhooks/products',
      events: ['product.created', 'product.updated'],
      secret: 'whsec_xyz789',
      isActive: false,
      createdAt: '2023-11-10',
    },
  ]);

  const availableEvents = [
    'order.created',
    'order.updated',
    'order.cancelled',
    'order.delivered',
    'product.created',
    'product.updated',
    'product.deleted',
    'payment.completed',
    'payment.failed',
    'customer.created',
    'customer.updated',
  ];

  const handleCreateKey = () => {
    setEditingKey(null);
    setIsKeyDialogOpen(true);
  };

  const handleSaveKey = () => {
    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk_live_${Math.random().toString(36).substr(2, 24)}`,
      permissions: [],
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success('API key created! Make sure to copy it now.');
    setIsKeyDialogOpen(false);
  };

  const handleCopyKey = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!');
  };

  const handleCreateWebhook = () => {
    setEditingWebhook(null);
    setIsWebhookDialogOpen(true);
  };

  const handleSaveWebhook = () => {
    if (editingWebhook) {
      toast.success('Webhook updated');
      setIsWebhookDialogOpen(false);
    } else {
      const newWebhook: Webhook = {
        id: `wh-${Date.now()}`,
        name: `Webhook ${webhooks.length + 1}`,
        url: '',
        events: [],
        secret: `whsec_${Math.random().toString(36).substr(2, 16)}`,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setWebhooks([...webhooks, newWebhook]);
      toast.success('Webhook created');
      setIsWebhookDialogOpen(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>API Management</H1>
          <P className="text-muted-foreground">
            Manage API keys and webhooks for integrations
          </P>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList>
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            API Keys ({apiKeys.length})
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks ({webhooks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreateKey}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                API keys allow third-party applications to access your platform
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>API Key</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {showKeys[apiKey.id]
                              ? apiKey.key
                              : `${apiKey.key.substring(0, 12)}...`}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {apiKey.permissions.slice(0, 2).map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                          {apiKey.permissions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{apiKey.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {apiKey.lastUsed
                          ? format(new Date(apiKey.lastUsed), 'MMM dd, yyyy')
                          : 'Never'}
                      </TableCell>
                      <TableCell>
                        {apiKey.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setApiKeys((prev) => prev.filter((k) => k.id !== apiKey.id));
                              toast.success('API key deleted');
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreateWebhook}>
              <Plus className="h-4 w-4 mr-2" />
              Create Webhook
            </Button>
          </div>

          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{webhook.name}</CardTitle>
                      <CardDescription className="mt-1">{webhook.url}</CardDescription>
                    </div>
                    {webhook.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm">Events</Label>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Muted>
                      Last triggered:{' '}
                      {webhook.lastTriggered
                        ? format(new Date(webhook.lastTriggered), 'MMM dd, yyyy HH:mm')
                        : 'Never'}
                    </Muted>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setWebhooks((prev) => prev.filter((w) => w.id !== webhook.id));
                          toast.success('Webhook deleted');
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create API Key Dialog */}
      <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key for third-party integrations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <P className="text-sm font-semibold mb-1">⚠️ Important</P>
              <Muted className="text-sm">
                Make sure to copy your API key immediately. You won't be able to see it again!
              </Muted>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Vendor Integration"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <Muted className="text-sm">
                Select permissions for this API key. You can configure this after creation.
              </Muted>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveKey}>Generate API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingWebhook ? 'Edit Webhook' : 'Create Webhook'}
            </DialogTitle>
            <DialogDescription>
              {editingWebhook
                ? 'Update webhook configuration'
                : 'Create a new webhook endpoint'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookName">Webhook Name *</Label>
              <Input
                id="webhookName"
                placeholder="e.g., Order Notifications"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL *</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://example.com/webhook"
              />
            </div>
            <div className="space-y-2">
              <Label>Events to Subscribe</Label>
              <Muted className="text-sm mb-2">
                Select which events should trigger this webhook
              </Muted>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-4">
                {availableEvents.map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <input type="checkbox" id={event} className="rounded" />
                    <Label htmlFor={event} className="text-sm cursor-pointer">
                      {event}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWebhookDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWebhook}>
              {editingWebhook ? 'Update' : 'Create'} Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Documentation Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <P className="mb-4">
            Comprehensive API documentation is available for developers.
          </P>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            View API Docs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAPIManagementPage;

