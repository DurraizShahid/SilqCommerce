import React, { useState, useMemo } from 'react';
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
import { Plus, Edit, Trash2, Send, Mail, Users, TrendingUp, Calendar, Eye, MousePointerClick } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import VendorMetricsCard from '@/components/vendor/VendorMetricsCard';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  recipientType: 'all' | 'customers' | 'subscribers' | 'segment';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  sentDate?: string;
  scheduledDate?: string;
  recipients: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  createdAt: string;
}

const VendorEmailCampaignsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates'>('campaigns');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    recipientType: 'subscribers' as EmailCampaign['recipientType'],
    scheduledDate: '',
    scheduledTime: '',
  });

  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([
    {
      id: 'c1',
      name: 'Holiday Sale Announcement',
      subject: 'Exclusive Holiday Sale - Up to 50% Off!',
      recipientType: 'subscribers',
      status: 'sent',
      sentDate: '2023-11-20',
      recipients: 1250,
      opened: 450,
      clicked: 125,
      unsubscribed: 5,
      createdAt: '2023-11-15',
    },
    {
      id: 'c2',
      name: 'New Collection Launch',
      subject: 'Introducing Our New Winter Collection',
      recipientType: 'customers',
      status: 'scheduled',
      scheduledDate: '2023-12-01',
      recipients: 850,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      createdAt: '2023-11-25',
    },
    {
      id: 'c3',
      name: 'Abandoned Cart Reminder',
      subject: 'Complete Your Purchase - Items Waiting!',
      recipientType: 'segment',
      status: 'draft',
      recipients: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      createdAt: '2023-11-28',
    },
  ]);

  const handleCreate = () => {
    setEditingCampaign(null);
    setCampaignForm({
      name: '',
      subject: '',
      recipientType: 'subscribers',
      scheduledDate: '',
      scheduledTime: '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!campaignForm.name || !campaignForm.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingCampaign) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === editingCampaign.id
            ? { ...c, ...campaignForm, updatedAt: new Date().toISOString() }
            : c
        )
      );
      toast.success('Campaign updated');
    } else {
      const newCampaign: EmailCampaign = {
        id: `c-${Date.now()}`,
        ...campaignForm,
        status: campaignForm.scheduledDate ? 'scheduled' : 'draft',
        scheduledDate: campaignForm.scheduledDate,
        recipients: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCampaigns([...campaigns, newCampaign]);
      toast.success('Campaign created');
    }
    setIsDialogOpen(false);
  };

  const handleSend = (campaign: EmailCampaign) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaign.id
          ? { ...c, status: 'sent', sentDate: new Date().toISOString().split('T')[0] }
          : c
      )
    );
    toast.success('Campaign sent!');
  };

  const getStatusBadge = (status: EmailCampaign['status']) => {
    const variants: Record<EmailCampaign['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
      draft: 'outline',
      scheduled: 'secondary',
      sending: 'secondary',
      sent: 'default',
      paused: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getOpenRate = (campaign: EmailCampaign) => {
    if (campaign.recipients === 0) return 0;
    return ((campaign.opened / campaign.recipients) * 100).toFixed(1);
  };

  const getClickRate = (campaign: EmailCampaign) => {
    if (campaign.recipients === 0) return 0;
    return ((campaign.clicked / campaign.recipients) * 100).toFixed(1);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Email Campaigns</H1>
          <P className="text-muted-foreground">Create and manage email marketing campaigns</P>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Metrics */}
      {(() => {
        const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0);
        const totalOpened = campaigns.reduce((sum, c) => sum + c.opened, 0);
        const totalClicked = campaigns.reduce((sum, c) => sum + c.clicked, 0);
        const avgOpenRate = campaigns.length > 0
          ? (campaigns.reduce((sum, c) => sum + parseFloat(getOpenRate(c)), 0) / campaigns.length)
          : 0;
        const avgClickRate = campaigns.length > 0
          ? (campaigns.reduce((sum, c) => sum + parseFloat(getClickRate(c)), 0) / campaigns.length)
          : 0;

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <VendorMetricsCard
              title="Total Campaigns"
              value={campaigns.length}
              icon={Mail}
              description="All campaigns"
            />
            <VendorMetricsCard
              title="Total Recipients"
              value={totalRecipients.toLocaleString()}
              icon={Users}
              description="Emails sent"
            />
            <VendorMetricsCard
              title="Avg Open Rate"
              value={`${avgOpenRate.toFixed(1)}%`}
              icon={Eye}
              description={`${totalOpened.toLocaleString()} opened`}
              trend={avgOpenRate > 20 ? 'up' : 'neutral'}
            />
            <VendorMetricsCard
              title="Avg Click Rate"
              value={`${avgClickRate.toFixed(1)}%`}
              icon={MousePointerClick}
              description={`${totalClicked.toLocaleString()} clicked`}
              trend={avgClickRate > 3 ? 'up' : 'neutral'}
            />
          </div>
        );
      })()}

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.subject}</TableCell>
                  <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                  <TableCell>
                    {campaign.recipients > 0 ? `${getOpenRate(campaign)}%` : '-'}
                  </TableCell>
                  <TableCell>
                    {campaign.recipients > 0 ? `${getClickRate(campaign)}%` : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>
                    {campaign.sentDate
                      ? format(new Date(campaign.sentDate), 'MMM dd, yyyy')
                      : campaign.scheduledDate
                      ? format(new Date(campaign.scheduledDate), 'MMM dd, yyyy')
                      : format(new Date(campaign.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCampaign(campaign);
                          setCampaignForm({
                            name: campaign.name,
                            subject: campaign.subject,
                            recipientType: campaign.recipientType,
                            scheduledDate: campaign.scheduledDate || '',
                            scheduledTime: '',
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {campaign.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSend(campaign)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign
                ? 'Update your email campaign'
                : 'Create a new email marketing campaign'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name *</Label>
              <Input
                id="campaignName"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                placeholder="e.g., Holiday Sale 2023"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignSubject">Email Subject *</Label>
              <Input
                id="campaignSubject"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                placeholder="e.g., Exclusive Sale - Up to 50% Off!"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientType">Recipient Type</Label>
              <Select
                value={campaignForm.recipientType}
                onValueChange={(value: any) =>
                  setCampaignForm({ ...campaignForm, recipientType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="customers">Past Customers</SelectItem>
                  <SelectItem value="subscribers">Email Subscribers</SelectItem>
                  <SelectItem value="segment">Custom Segment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Schedule Date (optional)</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={campaignForm.scheduledDate}
                  onChange={(e) =>
                    setCampaignForm({ ...campaignForm, scheduledDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Schedule Time (optional)</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={campaignForm.scheduledTime}
                  onChange={(e) =>
                    setCampaignForm({ ...campaignForm, scheduledTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <P className="text-sm font-semibold mb-2">Email Content</P>
              <Muted className="text-sm">
                Use the email editor to design your campaign content. You can add products, images,
                and customize the layout.
              </Muted>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCampaign ? 'Update' : 'Create'} Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorEmailCampaignsPage;

