import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface APIKey {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
  status: 'active' | 'revoked';
  rateLimit: number;
}

const APIKeysPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'sk_live_1234567890abcdef',
      maskedKey: 'sk_live_****...cdef',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      permissions: ['read:products', 'read:orders'],
      status: 'active',
      rateLimit: 10000,
    },
    {
      id: '2',
      name: 'Development Key',
      key: 'sk_test_abcdef1234567890',
      maskedKey: 'sk_test_****...7890',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['read:products', 'write:products'],
      status: 'active',
      rateLimit: 1000,
    },
  ]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const availablePermissions = [
    { id: 'read:products', label: 'Read Products' },
    { id: 'write:products', label: 'Write Products' },
    { id: 'read:orders', label: 'Read Orders' },
    { id: 'write:orders', label: 'Write Orders' },
    { id: 'read:customers', label: 'Read Customers' },
    { id: 'read:analytics', label: 'Read Analytics' },
    { id: 'manage:webhooks', label: 'Manage Webhooks' },
  ];

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }
    if (newKeyPermissions.length === 0) {
      toast.error('Please select at least one permission');
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      maskedKey: `sk_live_****...${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      permissions: newKeyPermissions,
      status: 'active',
      rateLimit: 10000,
    };

    setApiKeys([...apiKeys, newKey]);
    setIsCreateDialogOpen(false);
    setNewKeyName('');
    setNewKeyPermissions([]);
    toast.success('API key created successfully!');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: 'revoked' as const } : key
    ));
    toast.success('API key revoked');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success('API key deleted');
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    toast.success('API key copied to clipboard!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleRevealKey = (id: string) => {
    setRevealedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="flex items-center gap-2">
            <Key className="h-8 w-8 text-primary" />
            API Keys
          </H1>
          <P className="text-muted-foreground">
            Manage your API keys for authentication
          </P>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {apiKey.name}
                    {apiKey.status === 'active' ? (
                      <Badge className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Revoked
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Created {format(new Date(apiKey.createdAt), 'MMM dd, yyyy')}
                    {apiKey.lastUsed && (
                      <> • Last used {format(new Date(apiKey.lastUsed), 'MMM dd, yyyy HH:mm')}</>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleRevealKey(apiKey.id)}
                  >
                    {revealedKeys.has(apiKey.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                  >
                    {copiedKey === apiKey.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  {apiKey.status === 'active' && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRevokeKey(apiKey.id)}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteKey(apiKey.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>API Key</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                    {revealedKeys.has(apiKey.id) ? apiKey.key : apiKey.maskedKey}
                  </code>
                </div>
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {apiKey.permissions.map((perm) => (
                    <Badge key={perm} variant="outline">
                      {availablePermissions.find(p => p.id === perm)?.label || perm}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Rate Limit</Label>
                <P className="text-sm mt-1">{apiKey.rateLimit.toLocaleString()} requests/day</P>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key with specific permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production Key, Development Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availablePermissions.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={perm.id}
                      checked={newKeyPermissions.includes(perm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewKeyPermissions([...newKeyPermissions, perm.id]);
                        } else {
                          setNewKeyPermissions(newKeyPermissions.filter(p => p !== perm.id));
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={perm.id} className="cursor-pointer">
                      {perm.label}
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
            <Button onClick={handleCreateKey}>
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default APIKeysPage;

