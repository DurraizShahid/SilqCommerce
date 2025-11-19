import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Plus, Edit, Trash2, Share2, Copy, Calendar, Users, Package, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/dummyData';

interface GiftRegistry {
  id: string;
  name: string;
  description: string;
  eventType: 'wedding' | 'birthday' | 'baby-shower' | 'anniversary' | 'other';
  eventDate: string;
  shareLink: string;
  isPublic: boolean;
  productIds: string[];
  purchasedProductIds: string[];
  createdAt: string;
}

const GiftRegistryPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRegistry, setEditingRegistry] = useState<GiftRegistry | null>(null);
  const [registryForm, setRegistryForm] = useState({
    name: '',
    description: '',
    eventType: 'wedding' as GiftRegistry['eventType'],
    eventDate: '',
  });

  const [registries, setRegistries] = useState<GiftRegistry[]>([
    {
      id: 'gr1',
      name: 'Wedding Registry',
      description: 'Our dream wedding registry',
      eventType: 'wedding',
      eventDate: '2024-06-15',
      shareLink: 'https://luxurystore.com/registry/abc123',
      isPublic: true,
      productIds: ['prod1', 'prod2', 'prod3'],
      purchasedProductIds: ['prod1'],
      createdAt: '2023-10-15',
    },
    {
      id: 'gr2',
      name: 'Birthday Wishlist',
      description: 'Items I would love for my birthday',
      eventType: 'birthday',
      eventDate: '2024-01-20',
      shareLink: 'https://luxurystore.com/registry/xyz789',
      isPublic: false,
      productIds: ['prod4', 'prod5'],
      purchasedProductIds: [],
      createdAt: '2023-11-10',
    },
  ]);

  const handleCreate = () => {
    setEditingRegistry(null);
    setRegistryForm({
      name: '',
      description: '',
      eventType: 'wedding',
      eventDate: '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleSave = () => {
    if (!registryForm.name || !registryForm.eventDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingRegistry) {
      setRegistries((prev) =>
        prev.map((r) =>
          r.id === editingRegistry.id
            ? { ...r, ...registryForm, updatedAt: new Date().toISOString() }
            : r
        )
      );
      toast.success('Registry updated');
      setIsEditDialogOpen(false);
    } else {
      const newRegistry: GiftRegistry = {
        id: `gr-${Date.now()}`,
        ...registryForm,
        shareLink: `https://luxurystore.com/registry/${Math.random().toString(36).substr(2, 9)}`,
        isPublic: false,
        productIds: [],
        purchasedProductIds: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setRegistries([...registries, newRegistry]);
      toast.success('Gift registry created!');
      setIsCreateDialogOpen(false);
    }
  };

  const handleShare = (registry: GiftRegistry) => {
    navigator.clipboard.writeText(registry.shareLink);
    toast.success('Share link copied to clipboard!');
  };

  const getEventTypeLabel = (type: GiftRegistry['eventType']) => {
    const labels: Record<GiftRegistry['eventType'], string> = {
      wedding: 'Wedding',
      birthday: 'Birthday',
      'baby-shower': 'Baby Shower',
      anniversary: 'Anniversary',
      other: 'Other',
    };
    return labels[type];
  };

  const getCompletionPercentage = (registry: GiftRegistry) => {
    if (registry.productIds.length === 0) return 0;
    return (registry.purchasedProductIds.length / registry.productIds.length) * 100;
  };

  const registryProducts = (productIds: string[]) => {
    return products.filter((p) => productIds.includes(p.id));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Gift Registry</H1>
          <P className="text-muted-foreground">Create and manage your gift registries</P>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Registry
        </Button>
      </div>

      {registries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-2">No gift registries yet</P>
            <P className="text-sm text-muted-foreground mb-4">
              Create a gift registry to share with friends and family
            </P>
            <Button onClick={handleCreate}>Create Your First Registry</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {registries.map((registry) => {
            const registryItems = registryProducts(registry.productIds);
            const completion = getCompletionPercentage(registry);
            return (
              <Card key={registry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{registry.name}</CardTitle>
                      <CardDescription className="mt-1">{registry.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{getEventTypeLabel(registry.eventType)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Muted>
                        {format(new Date(registry.eventDate), 'MMM dd, yyyy')}
                      </Muted>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <Muted>{registry.productIds.length} items</Muted>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Muted>{registry.purchasedProductIds.length} purchased</Muted>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span className="font-semibold">{completion.toFixed(0)}%</span>
                    </div>
                    <Progress value={completion} className="h-2" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleShare(registry)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingRegistry(registry);
                        setRegistryForm({
                          name: registry.name,
                          description: registry.description,
                          eventType: registry.eventType,
                          eventDate: registry.eventDate,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRegistries((prev) => prev.filter((r) => r.id !== registry.id));
                        toast.success('Registry deleted');
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {registryItems.length > 0 && (
                    <div className="pt-4 border-t">
                      <P className="text-sm font-semibold mb-2">Registry Items:</P>
                      <div className="grid grid-cols-2 gap-2">
                        {registryItems.slice(0, 4).map((product) => (
                          <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="text-sm hover:text-primary"
                          >
                            {product.name}
                          </Link>
                        ))}
                        {registryItems.length > 4 && (
                          <Muted className="text-sm">
                            +{registryItems.length - 4} more
                          </Muted>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Gift Registry</DialogTitle>
            <DialogDescription>
              Create a new gift registry for your special event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registryName">Registry Name *</Label>
              <Input
                id="registryName"
                value={registryForm.name}
                onChange={(e) => setRegistryForm({ ...registryForm, name: e.target.value })}
                placeholder="e.g., Wedding Registry"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registryDescription">Description</Label>
              <Textarea
                id="registryDescription"
                value={registryForm.description}
                onChange={(e) => setRegistryForm({ ...registryForm, description: e.target.value })}
                rows={3}
                placeholder="Tell your guests about your registry..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type *</Label>
              <Select
                value={registryForm.eventType}
                onValueChange={(value: any) => setRegistryForm({ ...registryForm, eventType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="baby-shower">Baby Shower</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={registryForm.eventDate}
                onChange={(e) => setRegistryForm({ ...registryForm, eventDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Create Registry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gift Registry</DialogTitle>
            <DialogDescription>
              Update your gift registry details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editRegistryName">Registry Name *</Label>
              <Input
                id="editRegistryName"
                value={registryForm.name}
                onChange={(e) => setRegistryForm({ ...registryForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRegistryDescription">Description</Label>
              <Textarea
                id="editRegistryDescription"
                value={registryForm.description}
                onChange={(e) => setRegistryForm({ ...registryForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEventType">Event Type *</Label>
              <Select
                value={registryForm.eventType}
                onValueChange={(value: any) => setRegistryForm({ ...registryForm, eventType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="baby-shower">Baby Shower</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEventDate">Event Date *</Label>
              <Input
                id="editEventDate"
                type="date"
                value={registryForm.eventDate}
                onChange={(e) => setRegistryForm({ ...registryForm, eventDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Update Registry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GiftRegistryPage;

