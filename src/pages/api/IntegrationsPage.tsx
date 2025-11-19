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
import { 
  Plug, 
  CheckCircle, 
  XCircle,
  Settings,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  category: 'payment' | 'shipping' | 'email' | 'analytics' | 'crm' | 'erp' | 'marketing';
  description: string;
  icon?: string;
  status: 'connected' | 'disconnected' | 'pending';
  connectedAt?: string;
  lastSync?: string;
  config?: Record<string, string>;
}

const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Stripe',
      category: 'payment',
      description: 'Accept payments via Stripe',
      status: 'connected',
      connectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      config: { apiKey: 'sk_live_****' },
    },
    {
      id: '2',
      name: 'FedEx',
      category: 'shipping',
      description: 'Shipping integration with FedEx',
      status: 'connected',
      connectedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'SendGrid',
      category: 'email',
      description: 'Email delivery service',
      status: 'connected',
      connectedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Track website analytics',
      status: 'disconnected',
    },
    {
      id: '5',
      name: 'Salesforce',
      category: 'crm',
      description: 'CRM integration with Salesforce',
      status: 'disconnected',
    },
    {
      id: '6',
      name: 'Shopify',
      category: 'erp',
      description: 'Sync products with Shopify store',
      status: 'pending',
    },
  ]);

  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const categories = {
    payment: { label: 'Payment', color: 'bg-green-500' },
    shipping: { label: 'Shipping', color: 'bg-blue-500' },
    email: { label: 'Email', color: 'bg-purple-500' },
    analytics: { label: 'Analytics', color: 'bg-yellow-500' },
    crm: { label: 'CRM', color: 'bg-orange-500' },
    erp: { label: 'ERP', color: 'bg-red-500' },
    marketing: { label: 'Marketing', color: 'bg-pink-500' },
  };

  const handleConnect = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id 
        ? { ...int, status: 'connected' as const, connectedAt: new Date().toISOString() }
        : int
    ));
    toast.success('Integration connected successfully!');
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id 
        ? { ...int, status: 'disconnected' as const, connectedAt: undefined, lastSync: undefined }
        : int
    ));
    toast.success('Integration disconnected');
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsConfigDialogOpen(true);
  };

  const handleSync = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id 
        ? { ...int, lastSync: new Date().toISOString() }
        : int
    ));
    toast.success('Sync completed');
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <div className="space-y-8">
      <div>
        <H1 className="flex items-center gap-2">
          <Plug className="h-8 w-8 text-primary" />
          Integrations
        </H1>
        <P className="text-muted-foreground">
          Connect and manage third-party services
        </P>
      </div>

      {/* Integration Categories */}
      {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={categories[category as keyof typeof categories].color}>
              {categories[category as keyof typeof categories].label}
            </Badge>
            <P className="font-semibold">{categoryIntegrations.length} integrations</P>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    {integration.status === 'connected' ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : integration.status === 'pending' ? (
                      <Badge variant="secondary">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <XCircle className="h-3 w-3 mr-1" />
                        Disconnected
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {integration.status === 'connected' && integration.lastSync && (
                    <div className="text-xs text-muted-foreground">
                      Last synced: {new Date(integration.lastSync).toLocaleString()}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {integration.status === 'connected' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleConfigure(integration)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(integration.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="flex-1"
                        onClick={() => handleConnect(integration.id)}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Update integration settings and credentials
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedIntegration?.config && Object.entries(selectedIntegration.config).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{key}</Label>
                <Input
                  id={key}
                  type="password"
                  value={value}
                  readOnly
                />
              </div>
            ))}
            <div className="text-sm text-muted-foreground">
              Configuration details are securely stored and encrypted.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast.success('Configuration saved');
              setIsConfigDialogOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationsPage;

