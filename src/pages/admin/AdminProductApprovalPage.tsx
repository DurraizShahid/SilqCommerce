import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, CheckCircle, XCircle, Eye, Clock, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';

interface PendingProduct {
  id: string;
  name: string;
  vendorName: string;
  vendorId: string;
  category: string;
  price: number;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

const AdminProductApprovalPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedProduct, setSelectedProduct] = useState<PendingProduct | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([
    {
      id: 'pp1',
      name: 'Luxury Designer Handbag',
      vendorName: 'Luxury Boutique',
      vendorId: 'v1',
      category: 'Accessories',
      price: 599.99,
      submittedAt: '2023-11-10',
      status: 'pending',
    },
    {
      id: 'pp2',
      name: 'Premium Leather Wallet',
      vendorName: 'Designer Collection',
      vendorId: 'v2',
      category: 'Accessories',
      price: 149.99,
      submittedAt: '2023-11-09',
      status: 'pending',
    },
    {
      id: 'pp3',
      name: 'Designer Sunglasses',
      vendorName: 'Elite Fashion House',
      vendorId: 'v3',
      category: 'Accessories',
      price: 299.99,
      submittedAt: '2023-11-08',
      status: 'pending',
    },
    {
      id: 'pp4',
      name: 'Rejected Product Example',
      vendorName: 'Premium Accessories',
      vendorId: 'v4',
      category: 'Accessories',
      price: 199.99,
      submittedAt: '2023-11-05',
      status: 'rejected',
      rejectionReason: 'Product images do not meet quality standards',
    },
  ]);

  const filteredProducts = pendingProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = pendingProducts.filter((p) => p.status === 'pending').length;

  const handleApprove = (product: PendingProduct) => {
    setPendingProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: 'approved' } : p))
    );
    toast.success(`${product.name} has been approved`);
  };

  const handleReject = (product: PendingProduct) => {
    setSelectedProduct(product);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (!selectedProduct || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setPendingProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, status: 'rejected', rejectionReason }
          : p
      )
    );
    toast.success(`${selectedProduct.name} has been rejected`);
    setIsRejectDialogOpen(false);
    setRejectionReason('');
    setSelectedProduct(null);
  };

  const handleViewDetails = (product: PendingProduct) => {
    setSelectedProduct(product);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: PendingProduct['status']) => {
    const variants: Record<PendingProduct['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Product Approval</H1>
          <P className="text-muted-foreground">
            Review and approve vendor product submissions
            {pendingCount > 0 && (
              <Badge variant="default" className="ml-2">
                {pendingCount} Pending
              </Badge>
            )}
          </P>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingProducts.filter((p) => p.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pendingProducts.filter((p) => p.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pendingProducts.filter((p) => p.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products or vendors..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products Pending Approval</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Link to={`/vendor/${product.vendorId}`} className="text-primary hover:underline">
                      {product.vendorName}
                    </Link>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    {new Date(product.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {product.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(product)}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(product)}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {product.status === 'rejected' && product.rejectionReason && (
                        <Muted className="text-xs">{product.rejectionReason}</Muted>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Review product details before approval
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vendor</Label>
                  <P className="font-semibold">{selectedProduct.vendorName}</P>
                </div>
                <div>
                  <Label>Category</Label>
                  <P className="font-semibold">{selectedProduct.category}</P>
                </div>
                <div>
                  <Label>Price</Label>
                  <P className="font-semibold">{formatPrice(selectedProduct.price)}</P>
                </div>
                <div>
                  <Label>Submitted</Label>
                  <P className="font-semibold">
                    {new Date(selectedProduct.submittedAt).toLocaleDateString()}
                  </P>
                </div>
              </div>
              {selectedProduct.status === 'rejected' && selectedProduct.rejectionReason && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <Label className="text-red-600">Rejection Reason</Label>
                  <P className="text-sm">{selectedProduct.rejectionReason}</P>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            {selectedProduct?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleReject(selectedProduct);
                  }}
                  className="text-red-600"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(selectedProduct);
                    setIsDetailDialogOpen(false);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Product images do not meet quality standards, missing required information..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReject} className="bg-red-600 hover:bg-red-700">
              Reject Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductApprovalPage;


