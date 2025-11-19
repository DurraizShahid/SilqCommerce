import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  reorderPoint: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'reorder';
  lastUpdated: string;
  price: number;
}

const VendorInventoryPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    stock: 0,
    lowStockThreshold: 10,
    reorderPoint: 5,
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'inv1',
      productName: 'Luxury Handbag',
      sku: 'HB-001',
      currentStock: 45,
      reservedStock: 3,
      availableStock: 42,
      lowStockThreshold: 10,
      reorderPoint: 5,
      status: 'in-stock',
      lastUpdated: '2023-11-10',
      price: 299.99,
    },
    {
      id: 'inv2',
      productName: 'Designer Watch',
      sku: 'DW-002',
      currentStock: 8,
      reservedStock: 1,
      availableStock: 7,
      lowStockThreshold: 10,
      reorderPoint: 5,
      status: 'low-stock',
      lastUpdated: '2023-11-09',
      price: 599.99,
    },
    {
      id: 'inv3',
      productName: 'Premium Sunglasses',
      sku: 'PS-003',
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      lowStockThreshold: 10,
      reorderPoint: 5,
      status: 'out-of-stock',
      lastUpdated: '2023-11-08',
      price: 199.99,
    },
    {
      id: 'inv4',
      productName: 'Leather Wallet',
      sku: 'LW-004',
      currentStock: 3,
      reservedStock: 0,
      availableStock: 3,
      lowStockThreshold: 10,
      reorderPoint: 5,
      status: 'reorder',
      lastUpdated: '2023-11-07',
      price: 89.99,
    },
  ]);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: InventoryItem['status']) => {
    const variants: Record<InventoryItem['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'in-stock': 'default',
      'low-stock': 'secondary',
      'out-of-stock': 'destructive',
      'reorder': 'outline',
    };
    return <Badge variant={variants[status]}>{status.replace('-', ' ')}</Badge>;
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      stock: item.currentStock,
      lowStockThreshold: item.lowStockThreshold,
      reorderPoint: item.reorderPoint,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingItem) return;

    const updated = inventory.map((item) => {
      if (item.id === editingItem.id) {
        const newStock = formData.stock;
        const newStatus =
          newStock === 0
            ? 'out-of-stock'
            : newStock <= formData.reorderPoint
            ? 'reorder'
            : newStock <= formData.lowStockThreshold
            ? 'low-stock'
            : 'in-stock';

        return {
          ...item,
          currentStock: newStock,
          availableStock: newStock - item.reservedStock,
          lowStockThreshold: formData.lowStockThreshold,
          reorderPoint: formData.reorderPoint,
          status: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return item;
    });

    setInventory(updated);
    toast.success('Inventory updated');
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const lowStockItems = inventory.filter((item) => item.status === 'low-stock' || item.status === 'reorder' || item.status === 'out-of-stock');
  const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * item.price, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Inventory Management</H1>
          <P className="text-muted-foreground">Track and manage your product inventory</P>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              In Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventory.filter((i) => i.status === 'in-stock').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockItems.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <div>
                    <P className="font-semibold">{item.productName}</P>
                    <Muted className="text-sm">
                      {item.status === 'out-of-stock'
                        ? 'Out of stock'
                        : item.status === 'reorder'
                        ? `Below reorder point (${item.currentStock} units)`
                        : `Low stock (${item.currentStock} units)`}
                    </Muted>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="reorder">Reorder</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{item.sku}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.currentStock}</span>
                      {item.reservedStock > 0 && (
                        <Muted className="text-xs">({item.reservedStock} reserved)</Muted>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.availableStock}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
            <DialogDescription>
              Update stock levels and thresholds for {editingItem?.productName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Current Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })
                }
              />
              <Muted className="text-xs">Alert when stock falls below this level</Muted>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderPoint">Reorder Point</Label>
              <Input
                id="reorderPoint"
                type="number"
                min="0"
                value={formData.reorderPoint}
                onChange={(e) =>
                  setFormData({ ...formData, reorderPoint: parseInt(e.target.value) || 0 })
                }
              />
              <Muted className="text-xs">Trigger reorder when stock reaches this level</Muted>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorInventoryPage;

