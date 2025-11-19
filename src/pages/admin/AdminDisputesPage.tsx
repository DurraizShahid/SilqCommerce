import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, AlertTriangle, CheckCircle, XCircle, Eye, MessageSquare, Clock } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Dispute {
  id: string;
  orderNumber: string;
  customerName: string;
  vendorName: string;
  type: 'refund' | 'quality' | 'delivery' | 'other';
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  amount: number;
  description: string;
  customerEvidence: string[];
  vendorResponse?: string;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

const AdminDisputesPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionDecision, setResolutionDecision] = useState<'customer' | 'vendor' | 'partial'>('customer');

  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: 'd1',
      orderNumber: 'ORD-123456',
      customerName: 'John Doe',
      vendorName: 'Luxury Boutique',
      type: 'quality',
      status: 'open',
      amount: 599.99,
      description: 'Product received was damaged and not as described',
      customerEvidence: ['photo1.jpg', 'photo2.jpg'],
      createdAt: '2023-11-20',
    },
    {
      id: 'd2',
      orderNumber: 'ORD-123457',
      customerName: 'Jane Smith',
      vendorName: 'Designer Collection',
      type: 'refund',
      status: 'in_review',
      amount: 149.99,
      description: 'Requesting refund for wrong item received',
      customerEvidence: ['photo1.jpg'],
      vendorResponse: 'We apologize for the error. We will process the refund.',
      createdAt: '2023-11-18',
    },
    {
      id: 'd3',
      orderNumber: 'ORD-123458',
      customerName: 'Bob Johnson',
      vendorName: 'Elite Fashion House',
      type: 'delivery',
      status: 'resolved',
      amount: 299.99,
      description: 'Package never arrived',
      customerEvidence: [],
      vendorResponse: 'Tracking shows delivery was completed.',
      adminNotes: 'Resolved in favor of vendor. Package was delivered.',
      createdAt: '2023-11-15',
      resolvedAt: '2023-11-22',
    },
  ]);

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    const matchesType = typeFilter === 'all' || dispute.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    open: disputes.filter((d) => d.status === 'open').length,
    inReview: disputes.filter((d) => d.status === 'in_review').length,
    resolved: disputes.filter((d) => d.status === 'resolved').length,
    totalAmount: disputes
      .filter((d) => d.status === 'open' || d.status === 'in_review')
      .reduce((sum, d) => sum + d.amount, 0),
  };

  const handleResolve = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsResolveDialogOpen(true);
  };

  const confirmResolution = () => {
    if (!selectedDispute || !resolutionNotes.trim()) {
      toast.error('Please provide resolution notes');
      return;
    }

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              status: 'resolved',
              adminNotes: resolutionNotes,
              resolvedAt: new Date().toISOString(),
            }
          : d
      )
    );
    toast.success('Dispute resolved');
    setIsResolveDialogOpen(false);
    setResolutionNotes('');
    setSelectedDispute(null);
  };

  const getStatusBadge = (status: Dispute['status']) => {
    const variants: Record<Dispute['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      open: 'destructive',
      in_review: 'secondary',
      resolved: 'default',
      closed: 'outline',
    };
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>;
  };

  const getTypeBadge = (type: Dispute['type']) => {
    return <Badge variant="outline" className="capitalize">{type}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Dispute Resolution</H1>
          <P className="text-muted-foreground">Manage and resolve customer-vendor disputes</P>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Open Disputes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              In Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total at Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalAmount)}</div>
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
                  placeholder="Search disputes..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="quality">Quality</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Disputes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Disputes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="font-medium">{dispute.orderNumber}</TableCell>
                  <TableCell>{dispute.customerName}</TableCell>
                  <TableCell>{dispute.vendorName}</TableCell>
                  <TableCell>{getTypeBadge(dispute.type)}</TableCell>
                  <TableCell>{formatPrice(dispute.amount)}</TableCell>
                  <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                  <TableCell>
                    {format(new Date(dispute.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {(dispute.status === 'open' || dispute.status === 'in_review') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResolve(dispute)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolve
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

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Review dispute information and evidence
            </DialogDescription>
          </DialogHeader>
          {selectedDispute && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order Number</Label>
                  <P className="font-semibold">{selectedDispute.orderNumber}</P>
                </div>
                <div>
                  <Label>Amount</Label>
                  <P className="font-semibold">{formatPrice(selectedDispute.amount)}</P>
                </div>
                <div>
                  <Label>Customer</Label>
                  <P className="font-semibold">{selectedDispute.customerName}</P>
                </div>
                <div>
                  <Label>Vendor</Label>
                  <P className="font-semibold">{selectedDispute.vendorName}</P>
                </div>
                <div>
                  <Label>Type</Label>
                  <div className="mt-1">{getTypeBadge(selectedDispute.type)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedDispute.status)}</div>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <P className="text-sm text-muted-foreground mt-1">{selectedDispute.description}</P>
              </div>
              {selectedDispute.customerEvidence.length > 0 && (
                <div>
                  <Label>Customer Evidence</Label>
                  <div className="flex gap-2 mt-2">
                    {selectedDispute.customerEvidence.map((evidence, index) => (
                      <Badge key={index} variant="outline">
                        {evidence}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedDispute.vendorResponse && (
                <div className="bg-muted p-4 rounded-lg">
                  <Label>Vendor Response</Label>
                  <P className="text-sm mt-1">{selectedDispute.vendorResponse}</P>
                </div>
              )}
              {selectedDispute.adminNotes && (
                <div className="bg-primary/5 p-4 rounded-lg">
                  <Label>Admin Notes</Label>
                  <P className="text-sm mt-1">{selectedDispute.adminNotes}</P>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            {selectedDispute &&
              (selectedDispute.status === 'open' || selectedDispute.status === 'in_review') && (
                <Button onClick={() => handleResolve(selectedDispute)}>
                  Resolve Dispute
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Dispute</DialogTitle>
            <DialogDescription>
              Make a decision and provide resolution notes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDispute && (
              <div className="bg-muted p-4 rounded-lg">
                <P className="text-sm font-semibold mb-1">{selectedDispute.orderNumber}</P>
                <Muted className="text-sm">
                  {selectedDispute.customerName} vs {selectedDispute.vendorName}
                </Muted>
                <P className="text-sm font-semibold mt-2">
                  Amount: {formatPrice(selectedDispute.amount)}
                </P>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="resolutionDecision">Resolution Decision *</Label>
              <Select
                value={resolutionDecision}
                onValueChange={(value: any) => setResolutionDecision(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Favor Customer (Full Refund)</SelectItem>
                  <SelectItem value="vendor">Favor Vendor (No Refund)</SelectItem>
                  <SelectItem value="partial">Partial Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="resolutionNotes">Resolution Notes *</Label>
              <Textarea
                id="resolutionNotes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
                placeholder="Explain your decision and any actions taken..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmResolution} disabled={!resolutionNotes.trim()}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDisputesPage;

