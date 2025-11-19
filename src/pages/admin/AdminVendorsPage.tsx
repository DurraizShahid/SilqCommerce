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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, CheckCircle, XCircle, Eye, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';

interface Vendor {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verificationStatus: 'unverified' | 'pending' | 'verified';
  joinDate: string;
  totalSales: number;
  totalProducts: number;
  rating: number;
  commissionRate: number;
}

const AdminVendorsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | 'verify' | null>(null);

  const vendors: Vendor[] = [
    {
      id: 'v1',
      name: 'Luxury Boutique',
      email: 'contact@luxuryboutique.com',
      status: 'approved',
      verificationStatus: 'verified',
      joinDate: '2023-01-15',
      totalSales: 125000,
      totalProducts: 45,
      rating: 4.8,
      commissionRate: 15,
    },
    {
      id: 'v2',
      name: 'Designer Collection',
      email: 'info@designercollection.com',
      status: 'pending',
      verificationStatus: 'pending',
      joinDate: '2023-11-01',
      totalSales: 0,
      totalProducts: 12,
      rating: 0,
      commissionRate: 15,
    },
    {
      id: 'v3',
      name: 'Elite Fashion House',
      email: 'hello@elitefashion.com',
      status: 'approved',
      verificationStatus: 'verified',
      joinDate: '2023-03-20',
      totalSales: 89000,
      totalProducts: 32,
      rating: 4.6,
      commissionRate: 12,
    },
    {
      id: 'v4',
      name: 'Premium Accessories',
      email: 'support@premiumacc.com',
      status: 'suspended',
      verificationStatus: 'verified',
      joinDate: '2022-11-10',
      totalSales: 45000,
      totalProducts: 18,
      rating: 3.2,
      commissionRate: 15,
    },
  ];

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Vendor['status']) => {
    const variants: Record<Vendor['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive',
      suspended: 'outline',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getVerificationBadge = (status: Vendor['verificationStatus']) => {
    if (status === 'verified') {
      return <Badge variant="default" className="bg-green-500">Verified</Badge>;
    } else if (status === 'pending') {
      return <Badge variant="secondary">Pending Verification</Badge>;
    }
    return <Badge variant="outline">Unverified</Badge>;
  };

  const handleAction = (vendor: Vendor, action: 'approve' | 'reject' | 'suspend' | 'verify') => {
    setSelectedVendor(vendor);
    setActionType(action);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedVendor || !actionType) return;

    switch (actionType) {
      case 'approve':
        toast.success(`${selectedVendor.name} has been approved`);
        break;
      case 'reject':
        toast.success(`${selectedVendor.name} has been rejected`);
        break;
      case 'suspend':
        toast.success(`${selectedVendor.name} has been suspended`);
        break;
      case 'verify':
        toast.success(`${selectedVendor.name} has been verified`);
        break;
    }
    setIsDialogOpen(false);
    setSelectedVendor(null);
    setActionType(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Vendor Management</H1>
          <P className="text-muted-foreground">Manage vendors, approvals, and verifications</P>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors by name or email..."
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
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {vendors.filter((v) => v.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {vendors.filter((v) => v.verificationStatus === 'verified').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {vendors.filter((v) => v.status === 'suspended').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div>
                      <P className="font-semibold">{vendor.name}</P>
                      <Muted className="text-sm">{vendor.email}</Muted>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                  <TableCell>{getVerificationBadge(vendor.verificationStatus)}</TableCell>
                  <TableCell>{formatPrice(vendor.totalSales)}</TableCell>
                  <TableCell>{vendor.totalProducts}</TableCell>
                  <TableCell>
                    {vendor.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <span>{vendor.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    ) : (
                      <Muted>No ratings</Muted>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/vendor/${vendor.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {vendor.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(vendor, 'approve')}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(vendor, 'reject')}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {vendor.verificationStatus !== 'verified' && vendor.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(vendor, 'verify')}
                          className="text-blue-600"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      {vendor.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(vendor, 'suspend')}
                          className="text-orange-600"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve Vendor'}
              {actionType === 'reject' && 'Reject Vendor'}
              {actionType === 'suspend' && 'Suspend Vendor'}
              {actionType === 'verify' && 'Verify Vendor'}
            </DialogTitle>
            <DialogDescription>
              {selectedVendor && (
                <>
                  Are you sure you want to {actionType} <strong>{selectedVendor.name}</strong>?
                  {actionType === 'suspend' && ' This will prevent them from listing new products.'}
                  {actionType === 'reject' && ' This action cannot be undone.'}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVendorsPage;

