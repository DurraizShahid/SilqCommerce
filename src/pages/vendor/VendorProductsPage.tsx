import React, { useState } from 'react';
import { H1, P } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { products as initialProducts, categories } from '@/data/dummyData';
import { Product } from '@/data/dummyData';
import { Pencil, Trash2, Plus, Eye, Package, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from '@/components/ProductForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCurrency } from '@/context/CurrencyContext';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const VendorProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts.slice(0, 5)); // Vendor's products
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { formatPrice } = useCurrency();

  // Mock product statuses (in real app, this would come from backend)
  const productStatuses: Record<string, 'draft' | 'pending' | 'approved' | 'rejected'> = {
    'prod1': 'approved',
    'prod2': 'approved',
    'prod3': 'pending',
    'prod4': 'draft',
    'prod5': 'approved',
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (productId: string) => {
    const productToEdit = products.find((p) => p.id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDelete = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    toast.error(`Product deleted successfully!`);
  };

  const handleSaveProduct = (product: Product) => {
    if (product.id && products.some(p => p.id === product.id)) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
      toast.success(`Product "${product.name}" updated successfully!`);
    } else {
      setProducts([...products, { ...product, id: `prod-${Date.now()}` }]);
      toast.success(`Product "${product.name}" added successfully!`);
    }
    setIsFormOpen(false);
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
  };

  const getStatusBadge = (productId: string) => {
    const status = productStatuses[productId] || 'draft';
    const variants: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
      'approved': 'default',
      'pending': 'secondary',
      'draft': 'outline',
      'rejected': 'destructive',
    };
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || productStatuses[product.id] === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: products.length,
    approved: products.filter(p => productStatuses[p.id] === 'approved').length,
    pending: products.filter(p => productStatuses[p.id] === 'pending').length,
    draft: products.filter(p => productStatuses[p.id] === 'draft').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Product Management</H1>
          <P className="text-muted-foreground">Manage your product catalog</P>
        </div>
        <Button onClick={handleAddProduct} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div>{product.name}</div>
                        <P className="text-xs text-muted-foreground line-clamp-1">{product.description}</P>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                        {product.stock} units
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(product)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <P className="text-muted-foreground">No products found</P>
                    <Button onClick={handleAddProduct} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
      />

      <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingProduct?.name}</DialogTitle>
            <DialogDescription>Product Details</DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img src={viewingProduct.imageUrl} alt={viewingProduct.name} className="w-full rounded-lg" />
              </div>
              <div className="space-y-4">
                <div>
                  <P className="text-2xl font-bold">{formatPrice(viewingProduct.price)}</P>
                  <P className="text-muted-foreground mt-2">{viewingProduct.description}</P>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <P className="font-medium">Category:</P>
                    <P>{viewingProduct.category}</P>
                  </div>
                  <div className="flex justify-between">
                    <P className="font-medium">Stock:</P>
                    <Badge variant={viewingProduct.stock > 0 ? 'default' : 'destructive'}>
                      {viewingProduct.stock} units
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <P className="font-medium">Status:</P>
                    {getStatusBadge(viewingProduct.id)}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Link to={`/products/${viewingProduct.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View on Store</Button>
                  </Link>
                  <Button onClick={() => {
                    setViewingProduct(null);
                    handleEdit(viewingProduct.id);
                  }} className="flex-1">
                    Edit Product
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProductsPage;

