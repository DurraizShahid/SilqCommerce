import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Zap, Mail, Bell, ShoppingCart, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  conditions: string[];
  isActive: boolean;
  executions: number;
  lastExecuted?: string;
}

const AdminMarketingAutomationPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [ruleForm, setRuleForm] = useState({
    name: '',
    trigger: '',
    action: '',
    conditions: [] as string[],
  });

  const [rules, setRules] = useState<AutomationRule[]>([
    {
      id: 'r1',
      name: 'Abandoned Cart Recovery',
      trigger: 'cart_abandoned',
      action: 'send_email',
      conditions: ['cart_value > 50', 'time_since_abandon > 1 hour'],
      isActive: true,
      executions: 245,
      lastExecuted: '2023-11-28T10:30:00Z',
    },
    {
      id: 'r2',
      name: 'Welcome Email Series',
      trigger: 'user_registered',
      action: 'send_email_series',
      conditions: ['new_user = true'],
      isActive: true,
      executions: 1250,
      lastExecuted: '2023-11-28T09:15:00Z',
    },
    {
      id: 'r3',
      name: 'Price Drop Alert',
      trigger: 'price_changed',
      action: 'send_notification',
      conditions: ['price_decrease > 10%', 'user_has_alert = true'],
      isActive: true,
      executions: 89,
      lastExecuted: '2023-11-28T08:00:00Z',
    },
    {
      id: 'r4',
      name: 'Re-engagement Campaign',
      trigger: 'user_inactive',
      action: 'send_email',
      conditions: ['last_activity > 30 days', 'has_previous_orders = true'],
      isActive: false,
      executions: 0,
    },
  ]);

  const triggers = [
    { value: 'cart_abandoned', label: 'Cart Abandoned' },
    { value: 'user_registered', label: 'User Registered' },
    { value: 'order_placed', label: 'Order Placed' },
    { value: 'order_delivered', label: 'Order Delivered' },
    { value: 'price_changed', label: 'Price Changed' },
    { value: 'user_inactive', label: 'User Inactive' },
    { value: 'product_back_in_stock', label: 'Product Back in Stock' },
  ];

  const actions = [
    { value: 'send_email', label: 'Send Email' },
    { value: 'send_notification', label: 'Send Push Notification' },
    { value: 'send_sms', label: 'Send SMS' },
    { value: 'send_email_series', label: 'Send Email Series' },
    { value: 'apply_discount', label: 'Apply Discount Code' },
    { value: 'add_to_segment', label: 'Add to Segment' },
  ];

  const handleCreate = () => {
    setEditingRule(null);
    setRuleForm({
      name: '',
      trigger: '',
      action: '',
      conditions: [],
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!ruleForm.name || !ruleForm.trigger || !ruleForm.action) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingRule) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? { ...r, ...ruleForm, updatedAt: new Date().toISOString() }
            : r
        )
      );
      toast.success('Automation rule updated');
    } else {
      const newRule: AutomationRule = {
        id: `r-${Date.now()}`,
        ...ruleForm,
        isActive: false,
        executions: 0,
        createdAt: new Date().toISOString(),
      };
      setRules([...rules, newRule]);
      toast.success('Automation rule created');
    }
    setIsDialogOpen(false);
  };

  const handleToggle = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const getTriggerIcon = (trigger: string) => {
    if (trigger.includes('cart')) return <ShoppingCart className="h-4 w-4" />;
    if (trigger.includes('email')) return <Mail className="h-4 w-4" />;
    if (trigger.includes('notification')) return <Bell className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Marketing Automation</H1>
          <P className="text-muted-foreground">
            Create automated marketing workflows and campaigns
          </P>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Active Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter((r) => r.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Total Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.reduce((sum, r) => sum + r.executions, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Rules Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inactive Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rules.filter((r) => !r.isActive).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTriggerIcon(rule.trigger)}
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    {rule.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  <div className="space-y-1 mb-3">
                    <Muted className="text-sm">
                      <strong>Trigger:</strong> {triggers.find((t) => t.value === rule.trigger)?.label}
                    </Muted>
                    <Muted className="text-sm">
                      <strong>Action:</strong> {actions.find((a) => a.value === rule.action)?.label}
                    </Muted>
                    {rule.conditions.length > 0 && (
                      <Muted className="text-sm">
                        <strong>Conditions:</strong> {rule.conditions.join(', ')}
                      </Muted>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Executions: {rule.executions.toLocaleString()}</span>
                    {rule.lastExecuted && (
                      <span>
                        Last: {new Date(rule.lastExecuted).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => handleToggle(rule.id)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingRule(rule);
                      setRuleForm({
                        name: rule.name,
                        trigger: rule.trigger,
                        action: rule.action,
                        conditions: rule.conditions,
                      });
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Edit Automation Rule' : 'Create Automation Rule'}
            </DialogTitle>
            <DialogDescription>
              {editingRule
                ? 'Update your marketing automation rule'
                : 'Create a new automated marketing workflow'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name *</Label>
              <Input
                id="ruleName"
                value={ruleForm.name}
                onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                placeholder="e.g., Abandoned Cart Recovery"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger Event *</Label>
              <Select
                value={ruleForm.trigger}
                onValueChange={(value) => setRuleForm({ ...ruleForm, trigger: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggers.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action *</Label>
              <Select
                value={ruleForm.action}
                onValueChange={(value) => setRuleForm({ ...ruleForm, action: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditions">Conditions (optional)</Label>
              <Textarea
                id="conditions"
                value={ruleForm.conditions.join('\n')}
                onChange={(e) =>
                  setRuleForm({
                    ...ruleForm,
                    conditions: e.target.value.split('\n').filter((c) => c.trim()),
                  })
                }
                rows={3}
                placeholder="Enter conditions, one per line&#10;e.g., cart_value > 50&#10;time_since_abandon > 1 hour"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingRule ? 'Update' : 'Create'} Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMarketingAutomationPage;

