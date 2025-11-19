import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ScheduledProduct {
  id: string;
  productName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'cancelled';
  createdAt: string;
}

interface DraftProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  lastModified: string;
  completion: number; // percentage
}

const VendorProductSchedulingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scheduled' | 'drafts'>('scheduled');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
  });

  const [scheduledProducts, setScheduledProducts] = useState<ScheduledProduct[]>([
    {
      id: 's1',
      productName: 'Luxury Winter Collection',
      scheduledDate: '2023-12-01',
      scheduledTime: '10:00',
      status: 'scheduled',
      createdAt: '2023-11-15',
    },
    {
      id: 's2',
      productName: 'Holiday Special Edition',
      scheduledDate: '2023-12-15',
      scheduledTime: '09:00',
      status: 'scheduled',
      createdAt: '2023-11-20',
    },
  ]);

  const [draftProducts, setDraftProducts] = useState<DraftProduct[]>([
    {
      id: 'd1',
      name: 'Designer Handbag - Draft',
      category: 'Accessories',
      price: 299.99,
      lastModified: '2023-11-10',
      completion: 75,
    },
    {
      id: 'd2',
      name: 'Premium Watch Collection',
      category: 'Accessories',
      price: 599.99,
      lastModified: '2023-11-08',
      completion: 45,
    },
    {
      id: 'd3',
      name: 'Luxury Sunglasses',
      category: 'Accessories',
      price: 199.99,
      lastModified: '2023-11-05',
      completion: 90,
    },
  ]);

  const handleSchedule = () => {
    if (!scheduleData.date || !scheduleData.time) {
      toast.error('Please select both date and time');
      return;
    }

    const newSchedule: ScheduledProduct = {
      id: `s-${Date.now()}`,
      productName: `Product ${selectedProduct || 'New'}`,
      scheduledDate: scheduleData.date,
      scheduledTime: scheduleData.time,
      status: 'scheduled',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setScheduledProducts([...scheduledProducts, newSchedule]);
    toast.success('Product scheduled successfully!');
    setIsScheduleDialogOpen(false);
    setScheduleData({ date: '', time: '' });
  };

  const handleCancelSchedule = (id: string) => {
    setScheduledProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'cancelled' } : p))
    );
    toast.success('Schedule cancelled');
  };

  const handleDeleteDraft = (id: string) => {
    setDraftProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Draft deleted');
  };

  const getStatusBadge = (status: ScheduledProduct['status']) => {
    const variants: Record<ScheduledProduct['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      scheduled: 'default',
      published: 'secondary',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Product Scheduling & Drafts</H1>
          <P className="text-muted-foreground">Schedule product releases and manage drafts</P>
        </div>
        <Button onClick={() => setIsScheduleDialogOpen(true)}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Product
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Scheduled Products */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Products</CardTitle>
            <CardDescription>Products scheduled for future release</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {scheduledProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <P className="text-muted-foreground">No scheduled products</P>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.productName}</TableCell>
                      <TableCell>
                        {format(new Date(product.scheduledDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {product.scheduledTime}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {product.status === 'scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelSchedule(product.id)}
                              className="text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Draft Products */}
        <Card>
          <CardHeader>
            <CardTitle>Draft Products</CardTitle>
            <CardDescription>Products saved as drafts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {draftProducts.length === 0 ? (
              <div className="p-12 text-center">
                <P className="text-muted-foreground">No draft products</P>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draftProducts.map((draft) => (
                    <TableRow key={draft.id}>
                      <TableCell className="font-medium">{draft.name}</TableCell>
                      <TableCell>{draft.category}</TableCell>
                      <TableCell>${draft.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${draft.completion}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{draft.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(draft.lastModified), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDraft(draft.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Product Release</DialogTitle>
            <DialogDescription>
              Choose when to publish your product
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productSelect">Select Product</Label>
              <Select value={selectedProduct || ''} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {draftProducts.map((draft) => (
                    <SelectItem key={draft.id} value={draft.id}>
                      {draft.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleDate">Release Date *</Label>
              <Input
                id="scheduleDate"
                type="date"
                value={scheduleData.date}
                onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleTime">Release Time *</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={scheduleData.time}
                onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorProductSchedulingPage;


