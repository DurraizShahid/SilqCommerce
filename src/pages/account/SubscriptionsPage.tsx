import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { subscriptions } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { Calendar, Package, Pause, Play, X, Edit, Plus, TrendingUp, Clock, DollarSign, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const SubscriptionsPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [userSubscriptions, setUserSubscriptions] = useState(subscriptions);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<typeof subscriptions[0] | null>(null);
  const [newFrequency, setNewFrequency] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'active' | 'paused' | 'cancelled'>('active');

  const handlePause = (subscriptionId: string) => {
    setUserSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId ? { ...sub, status: 'paused' as const } : sub
      )
    );
    toast.success('Subscription paused');
  };

  const handleResume = (subscriptionId: string) => {
    setUserSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId ? { ...sub, status: 'active' as const } : sub
      )
    );
    toast.success('Subscription resumed');
  };

  const handleCancel = (subscriptionId: string) => {
    setUserSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId ? { ...sub, status: 'cancelled' as const } : sub
      )
    );
    toast.success('Subscription cancelled');
  };

  const handleEdit = (subscription: typeof subscriptions[0]) => {
    setEditingSubscription(subscription);
    setNewFrequency(subscription.frequency);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingSubscription) return;
    setUserSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === editingSubscription.id
          ? { ...sub, frequency: newFrequency as typeof sub.frequency }
          : sub
      )
    );
    toast.success('Subscription updated');
    setIsEditDialogOpen(false);
    setEditingSubscription(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'Weekly';
      case 'bi-weekly':
        return 'Bi-Weekly';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      default:
        return frequency;
    }
  };

  const activeSubscriptions = userSubscriptions.filter((s) => s.status === 'active');
  const pausedSubscriptions = userSubscriptions.filter((s) => s.status === 'paused');
  const cancelledSubscriptions = userSubscriptions.filter((s) => s.status === 'cancelled');

  const totalMonthlyValue = activeSubscriptions.reduce((sum, sub) => {
    const multiplier = sub.frequency === 'weekly' ? 4 : sub.frequency === 'bi-weekly' ? 2 : sub.frequency === 'monthly' ? 1 : 0.33;
    return sum + sub.price * sub.quantity * multiplier;
  }, 0);

  const getFilteredSubscriptions = () => {
    switch (activeTab) {
      case 'active':
        return activeSubscriptions;
      case 'paused':
        return pausedSubscriptions;
      case 'cancelled':
        return cancelledSubscriptions;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <H1>My Subscriptions</H1>
          <P className="text-muted-foreground">Manage your recurring product subscriptions</P>
        </div>
        <Link to="/products">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      {activeSubscriptions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <P className="text-2xl font-bold">{activeSubscriptions.length}</P>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <P className="text-2xl font-bold">{formatPrice(totalMonthlyValue)}</P>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <P className="text-2xl font-bold">{formatPrice(totalMonthlyValue * 0.1)}</P>
                <Muted className="text-xs">(10% discount)</Muted>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {userSubscriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <P className="text-lg text-muted-foreground mb-4">You don't have any active subscriptions.</P>
            <Button asChild>
              <a href="/products">Browse Products</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="paused">
              Paused ({pausedSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledSubscriptions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {getFilteredSubscriptions().length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <P className="text-lg text-muted-foreground">
                    No {activeTab} subscriptions
                  </P>
                </CardContent>
              </Card>
            ) : (
              getFilteredSubscriptions().map((subscription) => (
            <Card key={subscription.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{subscription.productName}</CardTitle>
                    <Muted className="mt-1">
                      {getFrequencyLabel(subscription.frequency)} delivery
                    </Muted>
                  </div>
                  <Badge variant={getStatusColor(subscription.status)}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Muted className="text-xs">Quantity</Muted>
                    <P className="font-semibold">{subscription.quantity}</P>
                  </div>
                  <div>
                    <Muted className="text-xs">Price</Muted>
                    <P className="font-semibold">{formatPrice(subscription.price)}</P>
                  </div>
                  <div>
                    <Muted className="text-xs">Next Delivery</Muted>
                    <P className="font-semibold flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(subscription.nextDeliveryDate).toLocaleDateString()}
                    </P>
                    <Muted className="text-xs mt-1">
                      {Math.ceil((new Date(subscription.nextDeliveryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days away
                    </Muted>
                  </div>
                  <div>
                    <Muted className="text-xs">Started</Muted>
                    <P className="font-semibold">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </P>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  {subscription.status === 'active' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handlePause(subscription.id)}>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(subscription)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </>
                  )}
                  {subscription.status === 'paused' && (
                    <Button variant="outline" size="sm" onClick={() => handleResume(subscription.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  {subscription.status !== 'cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(subscription.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>Change the delivery frequency for {editingSubscription?.productName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Frequency</label>
              <Select value={newFrequency} onValueChange={setNewFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionsPage;

