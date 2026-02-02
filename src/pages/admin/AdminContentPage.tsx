import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit, Trash2, Image as ImageIcon, Link as LinkIcon, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: 'homepage-top' | 'homepage-middle' | 'category-top';
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productIds: string[];
  isFeatured: boolean;
  createdAt: string;
}

const AdminContentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'banners' | 'collections'>('banners');
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 'b1',
      title: 'Holiday Sale',
      imageUrl: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070',
      linkUrl: '/products?sale=true',
      position: 'homepage-top',
      isActive: true,
      startDate: '2023-11-20',
      endDate: '2023-12-31',
      createdAt: '2023-11-15',
    },
    {
      id: 'b2',
      title: 'New Collection',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070',
      linkUrl: '/products?new=true',
      position: 'homepage-middle',
      isActive: true,
      startDate: '2023-11-01',
      endDate: '2023-12-31',
      createdAt: '2023-10-28',
    },
    {
      id: 'b3',
      title: 'Winter Luxe Edit',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
      linkUrl: '/products?category=Outerwear',
      position: 'homepage-top',
      isActive: true,
      startDate: '2023-12-01',
      endDate: '2024-01-15',
      createdAt: '2023-11-28',
    },
    {
      id: 'b4',
      title: 'Accessories Spotlight',
      imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
      linkUrl: '/products?category=Accessories',
      position: 'homepage-middle',
      isActive: true,
      startDate: '2023-11-10',
      endDate: '2024-01-10',
      createdAt: '2023-11-05',
    },
  ]);

  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 'c1',
      name: 'Luxury Essentials',
      description: 'Curated selection of luxury essentials',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2070',
      productIds: ['prod1', 'prod2', 'prod3'],
      isFeatured: true,
      createdAt: '2023-10-15',
    },
    {
      id: 'c2',
      name: 'Holiday Collection',
      description: 'Perfect gifts for the holiday season',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070',
      productIds: ['prod4', 'prod5'],
      isFeatured: false,
      createdAt: '2023-11-01',
    },
    {
      id: 'c3',
      name: 'Modern Tailoring',
      description: 'Clean lines and sharp silhouettes for everyday luxury',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=2070&auto=format&fit=crop',
      productIds: ['prod6', 'prod8', 'prod10'],
      isFeatured: true,
      createdAt: '2023-11-12',
    },
    {
      id: 'c4',
      name: 'City Essentials',
      description: 'Versatile pieces designed for the modern city wardrobe',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2070&auto=format&fit=crop',
      productIds: ['prod1', 'prod7', 'prod9'],
      isFeatured: false,
      createdAt: '2023-11-18',
    },
  ]);

  const [bannerForm, setBannerForm] = useState({
    title: '',
    imageUrl: '',
    linkUrl: '',
    position: 'homepage-top' as Banner['position'],
    isActive: true,
    startDate: '',
    endDate: '',
  });

  const [collectionForm, setCollectionForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    productIds: [] as string[],
    isFeatured: false,
  });

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: '',
      imageUrl: '',
      linkUrl: '',
      position: 'homepage-top',
      isActive: true,
      startDate: '',
      endDate: '',
    });
    setIsBannerDialogOpen(true);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.title || !bannerForm.imageUrl || !bannerForm.linkUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) => (b.id === editingBanner.id ? { ...b, ...bannerForm } : b))
      );
      toast.success('Banner updated');
    } else {
      const newBanner: Banner = {
        id: `b-${Date.now()}`,
        ...bannerForm,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setBanners([...banners, newBanner]);
      toast.success('Banner created');
    }
    setIsBannerDialogOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success('Banner deleted');
  };

  const handleCreateCollection = () => {
    setEditingCollection(null);
    setCollectionForm({
      name: '',
      description: '',
      imageUrl: '',
      productIds: [],
      isFeatured: false,
    });
    setIsCollectionDialogOpen(true);
  };

  const handleSaveCollection = () => {
    if (!collectionForm.name || !collectionForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingCollection) {
      setCollections((prev) =>
        prev.map((c) => (c.id === editingCollection.id ? { ...c, ...collectionForm } : c))
      );
      toast.success('Collection updated');
    } else {
      const newCollection: Collection = {
        id: `c-${Date.now()}`,
        ...collectionForm,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCollections([...collections, newCollection]);
      toast.success('Collection created');
    }
    setIsCollectionDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Content Management</H1>
          <P className="text-muted-foreground">Manage banners, collections, and promotional content</P>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="banners">
            <ImageIcon className="h-4 w-4 mr-2" />
            Banners ({banners.length})
          </TabsTrigger>
          <TabsTrigger value="collections">
            <LinkIcon className="h-4 w-4 mr-2" />
            Collections ({collections.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreateBanner}>
              <Plus className="h-4 w-4 mr-2" />
              Create Banner
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {banners.map((banner) => (
              <Card key={banner.id}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  {banner.isActive && (
                    <Badge className="absolute top-2 right-2">Active</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{banner.title}</CardTitle>
                  <CardDescription>
                    Position: {banner.position.replace('-', ' ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Muted>Start Date</Muted>
                    <P>{format(new Date(banner.startDate), 'MMM dd, yyyy')}</P>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Muted>End Date</Muted>
                    <P>{format(new Date(banner.endDate), 'MMM dd, yyyy')}</P>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBanner(banner);
                        setBannerForm({ ...banner });
                        setIsBannerDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={handleCreateCollection}>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Card key={collection.id}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={collection.imageUrl}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                  {collection.isFeatured && (
                    <Badge className="absolute top-2 right-2">Featured</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{collection.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {collection.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <Muted>Products</Muted>
                    <P>{collection.productIds.length} items</P>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCollection(collection);
                        setCollectionForm({ ...collection });
                        setIsCollectionDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCollections((prev) => prev.filter((c) => c.id !== collection.id));
                        toast.success('Collection deleted');
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Banner Dialog */}
      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Banner' : 'Create New Banner'}
            </DialogTitle>
            <DialogDescription>
              Configure promotional banner settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bannerTitle">Title *</Label>
              <Input
                id="bannerTitle"
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerImageUrl">Image URL *</Label>
              <Input
                id="bannerImageUrl"
                value={bannerForm.imageUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerLinkUrl">Link URL *</Label>
              <Input
                id="bannerLinkUrl"
                value={bannerForm.linkUrl}
                onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                placeholder="/products?category=..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bannerPosition">Position</Label>
              <Select
                value={bannerForm.position}
                onValueChange={(value: any) => setBannerForm({ ...bannerForm, position: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage-top">Homepage Top</SelectItem>
                  <SelectItem value="homepage-middle">Homepage Middle</SelectItem>
                  <SelectItem value="category-top">Category Top</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bannerStartDate">Start Date</Label>
                <Input
                  id="bannerStartDate"
                  type="date"
                  value={bannerForm.startDate}
                  onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bannerEndDate">End Date</Label>
                <Input
                  id="bannerEndDate"
                  type="date"
                  value={bannerForm.endDate}
                  onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bannerActive">Active</Label>
                <Muted className="block text-sm">Show banner on site</Muted>
              </div>
              <Switch
                id="bannerActive"
                checked={bannerForm.isActive}
                onCheckedChange={(checked) => setBannerForm({ ...bannerForm, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBannerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBanner}>
              {editingBanner ? 'Update' : 'Create'} Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Collection Dialog */}
      <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCollection ? 'Edit Collection' : 'Create New Collection'}
            </DialogTitle>
            <DialogDescription>
              Create a curated product collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collectionName">Collection Name *</Label>
              <Input
                id="collectionName"
                value={collectionForm.name}
                onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionDescription">Description *</Label>
              <Textarea
                id="collectionDescription"
                value={collectionForm.description}
                onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionImageUrl">Image URL</Label>
              <Input
                id="collectionImageUrl"
                value={collectionForm.imageUrl}
                onChange={(e) => setCollectionForm({ ...collectionForm, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="collectionFeatured">Featured Collection</Label>
                <Muted className="block text-sm">Show prominently on homepage</Muted>
              </div>
              <Switch
                id="collectionFeatured"
                checked={collectionForm.isFeatured}
                onCheckedChange={(checked) =>
                  setCollectionForm({ ...collectionForm, isFeatured: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCollectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCollection}>
              {editingCollection ? 'Update' : 'Create'} Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContentPage;


