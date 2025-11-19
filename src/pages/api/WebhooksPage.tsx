import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
  createdAt: string;
  lastTriggered?: string;
  successCount: number;
  failureCount: number;
}

interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  status: 'success' | 'failed';
  timestamp: string;
  responseCode?: number;
  responseTime?: number;
  error?: string;
}

const WebhooksPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([
    {
      id: '1',
      name: 'Order Notifications',
      url: 'https://myapp.com/webhooks/orders',
      events: ['order.created', 'order.updated', 'order.cancelled'],
      status: 'active',
      secret: 'whsec_****...',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      successCount: 1250,
      failureCount: 5,
    },
    {
      id: '2',
      name: 'Product Sync',
      url: 'https://myapp.com/webhooks/products',
      events: ['product.created', 'product.updated'],
      status: 'active',
      secret: 'whsec_****...',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      successCount: 450,
      failureCount: 2,
    },
  ]);

  const [logs, setLogs] = useState<WebhookLog[]>([
    {
      id: '1',
      webhookId: '1',
      event: 'order.created',
      status: 'success',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      responseCode: 200,
      responseTime: 125,
    },
    {
      id: '2',
      webhookId: '1',
      event: 'order.updated',
      status: 'success',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      responseCode: 200,
      responseTime: 98,
    },
    {
      id: '3',
      webhookId: '1',
      event: 'order.created',
      status: 'failed',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      responseCode: 500,
      responseTime: 5000,
      error: 'Connection timeout',
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const availableEvents = [
    { id: 'order.created', label: 'Order Created' },
    { id: 'order.updated', label: 'Order Updated' },
    { id: 'order.cancelled', label: 'Order Cancelled' },
    { id: 'order.shipped', label: 'Order Shipped' },
    { id: 'product.created', label: 'Product Created' },
    { id: 'product.updated', label: 'Product Updated' },
    { id: 'product.deleted', label: 'Product Deleted' },
    { id: 'customer.created', label: 'Customer Created' },
    { id: 'payment.completed', label: 'Payment Completed' },
    { id: 'payment.failed', label: 'Payment Failed' },
  ];

  const handleCreateWebhook = () => {
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (selectedEvents.length === 0) {
      toast.error('Please select at least one event');
      return;
    }

    const newWebhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: selectedEvents,
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
      successCount: 0,
      failureCount: 0,
    };

    setWebhooks([...webhooks, newWebhook]);
    setIsCreateDialogOpen(false);
    setNewWebhookName('');
    setNewWebhookUrl('');
    setSelectedEvents([]);
    toast.success('Webhook created successfully!');
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(wh => 
      wh.id === id ? { ...wh, status: wh.status === 'active' ? 'inactive' : 'active' } : wh
    ));
    toast.success('Webhook status updated');
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(wh => wh.id !== id));
    setLogs(logs.filter(log => log.webhookId !== id));
    toast.success('Webhook deleted');
  };

  const filteredLogs = (webhookId?: string) => {
    if (!webhookId) return logs;
    return logs.filter(log => log.webhookId === webhookId);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="flex items-center gap-2">
            <Webhook className="h-8 w-8 text-primary" />
            Webhooks
          </H1>
          <P className="text-muted-foreground">
            Configure webhooks to receive real-time event notifications
          </P>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Webhook
        </Button>
      </div>

      <Tabs defaultValue="webhooks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {webhook.name}
                      {webhook.status === 'active' ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Created {format(new Date(webhook.createdAt), 'MMM dd, yyyy')}
                      {webhook.lastTriggered && (
                        <> • Last triggered {format(new Date(webhook.lastTriggered), 'MMM dd, yyyy HH:mm')}</>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`toggle-${webhook.id}`} className="text-sm">
                        {webhook.status === 'active' ? 'Active' : 'Inactive'}
                      </Label>
                      <Switch
                        id={`toggle-${webhook.id}`}
                        checked={webhook.status === 'active'}
                        onCheckedChange={() => handleToggleWebhook(webhook.id)}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Webhook URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                      {webhook.url}
                    </code>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Events</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline">
                        {availableEvents.find(e => e.id === event)?.label || event}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <Muted className="text-xs">Success Rate</Muted>
                    <P className="text-lg font-bold text-green-600">
                      {webhook.successCount + webhook.failureCount > 0
                        ? Math.round((webhook.successCount / (webhook.successCount + webhook.failureCount)) * 100)
                        : 0}%
                    </P>
                  </div>
                  <div>
                    <Muted className="text-xs">Total Calls</Muted>
                    <P className="text-lg font-bold">
                      {(webhook.successCount + webhook.failureCount).toLocaleString()}
                    </P>
                  </div>
                  <div>
                    <Muted className="text-xs">Failures</Muted>
                    <P className="text-lg font-bold text-red-600">
                      {webhook.failureCount}
                    </P>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Logs</CardTitle>
              <CardDescription>Recent webhook delivery attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredLogs().map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {log.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <P className="font-semibold text-sm">{log.event}</P>
                        <Muted className="text-xs">
                          {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                        </Muted>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {log.responseCode && (
                        <Badge variant="outline">{log.responseCode}</Badge>
                      )}
                      {log.responseTime && (
                        <Muted className="text-xs">{log.responseTime}ms</Muted>
                      )}
                      {log.error && (
                        <Muted className="text-xs text-red-600">{log.error}</Muted>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Webhook Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Webhook</DialogTitle>
            <DialogDescription>
              Set up a webhook to receive real-time event notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhookName">Webhook Name</Label>
              <Input
                id="webhookName"
                placeholder="e.g., Order Notifications"
                value={newWebhookName}
                onChange={(e) => setNewWebhookName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://your-app.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Events</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                {availableEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={event.id}
                      checked={selectedEvents.includes(event.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEvents([...selectedEvents, event.id]);
                        } else {
                          setSelectedEvents(selectedEvents.filter(e => e !== event.id));
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={event.id} className="cursor-pointer">
                      {event.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWebhook}>
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebhooksPage;

