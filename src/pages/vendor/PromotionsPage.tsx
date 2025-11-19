import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock, Tag, Zap, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromotionCard from '@/components/marketing/PromotionCard';
import VendorMetricsCard from '@/components/vendor/VendorMetricsCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCurrency } from '@/context/CurrencyContext';

interface Promotion {
  id: string;
  name: string;
  type: 'coupon' | 'flash-sale' | 'discount';
  code?: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'expired' | 'paused';
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  revenue?: number;
  orders?: number;
}

const PromotionsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'promo1',
      name: 'Summer Sale',
      type: 'coupon',
      code: 'SUMMER20',
      discount: 20,
      discountType: 'percentage',
      startDate: '2023-11-01',
      endDate: '2023-12-31',
      status: 'active',
      minPurchase: 100,
      usageLimit: 1000,
      usedCount: 342,
      revenue: 12500,
      orders: 156,
    },
    {
      id: 'promo2',
      name: 'Flash Sale - Black Friday',
      type: 'flash-sale',
      discount: 30,
      discountType: 'percentage',
      startDate: '2023-11-24',
      endDate: '2023-11-25',
      status: 'scheduled',
      usedCount: 0,
      revenue: 0,
      orders: 0,
    },
    {
      id: 'promo3',
      name: 'Holiday Special',
      type: 'coupon',
      code: 'HOLIDAY15',
      discount: 15,
      discountType: 'percentage',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      status: 'active',
      usageLimit: 500,
      usedCount: 89,
      revenue: 3200,
      orders: 45,
    },
  ]);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const matchesStatus = statusFilter === 'all' || promo.status === statusFilter;
      const matchesType = typeFilter === 'all' || promo.type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [promotions, statusFilter, typeFilter]);

  const promotionMetrics = useMemo(() => {
    const activePromotions = promotions.filter(p => p.status === 'active');
    const totalRevenue = promotions.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const totalOrders = promotions.reduce((sum, p) => sum + (p.orders || 0), 0);
    const totalUsage = promotions.reduce((sum, p) => sum + p.usedCount, 0);
    
    return {
      active: activePromotions.length,
      totalRevenue,
      totalOrders,
      totalUsage,
    };
  }, [promotions]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<Partial<Promotion>>({
    name: '',
    type: 'coupon',
    discount: 0,
    discountType: 'percentage',
    startDate: '',
    endDate: '',
    status: 'scheduled',
  });

  const handleCreate = () => {
    setEditingPromotion(null);
    setFormData({
      name: '',
      type: 'coupon',
      discount: 0,
      discountType: 'percentage',
      startDate: '',
      endDate: '',
      status: 'scheduled',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData(promotion);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingPromotion) {
      setPromotions((prev) =>
        prev.map((p) => (p.id === editingPromotion.id ? { ...formData, ...editingPromotion } as Promotion : p))
      );
      toast.success('Promotion updated');
    } else {
      const newPromotion: Promotion = {
        id: `promo-${Date.now()}`,
        name: formData.name!,
        type: formData.type || 'coupon',
        code: formData.type === 'coupon' ? formData.code || `CODE${Date.now()}` : undefined,
        discount: formData.discount || 0,
        discountType: formData.discountType || 'percentage',
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        status: formData.status || 'scheduled',
        minPurchase: formData.minPurchase,
        maxDiscount: formData.maxDiscount,
        usageLimit: formData.usageLimit,
        usedCount: 0,
      };
      setPromotions([newPromotion, ...promotions]);
      toast.success('Promotion created');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    toast.success('Promotion deleted');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'expired':
        return 'outline';
      case 'paused':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coupon':
        return <Tag className="h-4 w-4" />;
      case 'flash-sale':
        return <Zap className="h-4 w-4" />;
      case 'discount':
        return <Tag className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Promotions & Discounts</H1>
          <P className="text-muted-foreground">Create and manage coupons, flash sales, and discounts</P>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <VendorMetricsCard
          title="Active Promotions"
          value={promotionMetrics.active}
          icon={Tag}
          description="Currently running"
          variant="success"
        />
        <VendorMetricsCard
          title="Total Revenue"
          value={formatPrice(promotionMetrics.totalRevenue)}
          icon={DollarSign}
          description="From promotions"
        />
        <VendorMetricsCard
          title="Total Orders"
          value={promotionMetrics.totalOrders}
          icon={Users}
          description="Promotion-driven"
        />
        <VendorMetricsCard
          title="Total Usage"
          value={promotionMetrics.totalUsage.toLocaleString()}
          icon={TrendingUp}
          description="Times redeemed"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="coupon">Coupon</SelectItem>
                  <SelectItem value="flash-sale">Flash Sale</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotions Display */}
      {viewMode === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPromotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              onClick={() => handleEdit(promotion)}
            />
          ))}
          {filteredPromotions.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-lg text-muted-foreground mb-4">No promotions found.</P>
                <Button onClick={handleCreate}>Create Promotion</Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Promotions</CardTitle>
            <CardDescription>View and manage all your promotions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">{promotion.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(promotion.type)}
                        <span className="capitalize">{promotion.type.replace('-', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {promotion.discountType === 'percentage'
                        ? `${promotion.discount}%`
                        : formatPrice(promotion.discount)}
                    </TableCell>
                    <TableCell>
                      {promotion.code ? (
                        <Badge variant="outline" className="font-mono">{promotion.code}</Badge>
                      ) : (
                        <Muted>-</Muted>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(promotion.startDate).toLocaleDateString()}</div>
                        <Muted className="text-xs">to {new Date(promotion.endDate).toLocaleDateString()}</Muted>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(promotion.status)}>
                        {promotion.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {promotion.usageLimit
                        ? `${promotion.usedCount} / ${promotion.usageLimit}`
                        : promotion.usedCount}
                    </TableCell>
                    <TableCell>
                      {promotion.revenue ? formatPrice(promotion.revenue) : <Muted>-</Muted>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(promotion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(promotion.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredPromotions.length === 0 && (
              <div className="py-12 text-center">
                <P className="text-muted-foreground">No promotions found matching your filters.</P>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? 'Edit Promotion' : 'Create Promotion'}</DialogTitle>
            <DialogDescription>
              Set up a new promotion, coupon code, or flash sale
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Promotion Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Sale 2023"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coupon">Coupon Code</SelectItem>
                    <SelectItem value="flash-sale">Flash Sale</SelectItem>
                    <SelectItem value="discount">Automatic Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === 'coupon' && (
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER20"
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Amount *</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => setFormData({ ...formData, discountType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPurchase">Minimum Purchase</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  value={formData.minPurchase || ''}
                  onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || undefined })}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max Discount</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount || ''}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) || undefined })}
                  placeholder="Optional"
                />
              </div>
            </div>
            {formData.type === 'coupon' && (
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit || ''}
                  onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || undefined })}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPromotion ? 'Update' : 'Create'} Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionsPage;

