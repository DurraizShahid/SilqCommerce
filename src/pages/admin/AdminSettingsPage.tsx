import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Globe, DollarSign, Mail, Shield, Bell, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    general: {
      platformName: 'SilqCommerce',
      platformTagline: 'Luxury Marketplace',
      supportEmail: 'support@silqcommerce.com',
      supportPhone: '+1 (555) 123-4567',
      defaultCurrency: 'USD',
      defaultLanguage: 'en',
      timezone: 'UTC',
      maintenanceMode: false,
    },
    commission: {
      defaultCommissionRate: 15,
      minimumCommissionRate: 5,
      maximumCommissionRate: 30,
      commissionModel: 'percentage' as 'percentage' | 'fixed' | 'tiered',
    },
    payments: {
      paymentMethods: ['card', 'wallet', 'bnpl'],
      escrowEnabled: true,
      escrowHoldDays: 7,
      payoutSchedule: 'bi-weekly' as 'weekly' | 'bi-weekly' | 'monthly',
      minimumPayoutAmount: 50,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      orderNotifications: true,
      vendorNotifications: true,
      adminNotifications: true,
    },
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      enableMFA: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
    },
    features: {
      enableReviews: true,
      enableRatings: true,
      enableWishlist: true,
      enableComparison: true,
      enableLoyaltyProgram: true,
      enableReferralProgram: true,
      enableSubscriptions: true,
      enablePreOrders: true,
    },
  });

  const handleSave = (section: string) => {
    // In real app, this would save to backend
    localStorage.setItem(`admin_settings_${section}`, JSON.stringify(settings[section as keyof typeof settings]));
    toast.success(`${section} settings saved successfully!`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Platform Settings</H1>
          <P className="text-muted-foreground">Configure platform-wide settings and preferences</P>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="commission">
            <DollarSign className="h-4 w-4 mr-2" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="features">
            <Globe className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name *</Label>
                <Input
                  id="platformName"
                  value={settings.general.platformName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, platformName: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platformTagline">Platform Tagline</Label>
                <Input
                  id="platformTagline"
                  value={settings.general.platformTagline}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, platformTagline: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email *</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, supportEmail: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.general.supportPhone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, supportPhone: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={settings.general.defaultCurrency}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, defaultCurrency: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select
                    value={settings.general.defaultLanguage}
                    onValueChange={(value) =>
                      setSettings({
                        ...settings,
                        general: { ...settings.general, defaultLanguage: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <Muted className="block text-sm">Enable to put platform in maintenance mode</Muted>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      general: { ...settings.general, maintenanceMode: checked },
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave('general')}>
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Settings</CardTitle>
              <CardDescription>Configure vendor commission structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultCommissionRate">Default Commission Rate (%)</Label>
                <Input
                  id="defaultCommissionRate"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.commission.defaultCommissionRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commission: {
                        ...settings.commission,
                        defaultCommissionRate: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minimumCommissionRate">Minimum Commission Rate (%)</Label>
                  <Input
                    id="minimumCommissionRate"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.commission.minimumCommissionRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        commission: {
                          ...settings.commission,
                          minimumCommissionRate: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maximumCommissionRate">Maximum Commission Rate (%)</Label>
                  <Input
                    id="maximumCommissionRate"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.commission.maximumCommissionRate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        commission: {
                          ...settings.commission,
                          maximumCommissionRate: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commissionModel">Commission Model</Label>
                <Select
                  value={settings.commission.commissionModel}
                  onValueChange={(value: any) =>
                    setSettings({
                      ...settings,
                      commission: { ...settings.commission, commissionModel: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleSave('commission')}>
                <Save className="h-4 w-4 mr-2" />
                Save Commission Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment processing and payouts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="escrowEnabled">Escrow System</Label>
                  <Muted className="block text-sm">Hold payments until order fulfillment</Muted>
                </div>
                <Switch
                  id="escrowEnabled"
                  checked={settings.payments.escrowEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      payments: { ...settings.payments, escrowEnabled: checked },
                    })
                  }
                />
              </div>
              {settings.payments.escrowEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="escrowHoldDays">Escrow Hold Period (Days)</Label>
                  <Input
                    id="escrowHoldDays"
                    type="number"
                    min="1"
                    value={settings.payments.escrowHoldDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payments: {
                          ...settings.payments,
                          escrowHoldDays: parseInt(e.target.value) || 7,
                        },
                      })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                <Select
                  value={settings.payments.payoutSchedule}
                  onValueChange={(value: any) =>
                    setSettings({
                      ...settings,
                      payments: { ...settings.payments, payoutSchedule: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumPayoutAmount">Minimum Payout Amount</Label>
                <Input
                  id="minimumPayoutAmount"
                  type="number"
                  min="0"
                  value={settings.payments.minimumPayoutAmount}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payments: {
                        ...settings.payments,
                        minimumPayoutAmount: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave('payments')}>
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Muted className="block text-sm">Enable email notifications</Muted>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <Muted className="block text-sm">Enable browser push notifications</Muted>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushNotifications: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="orderNotifications">Order Notifications</Label>
                  <Muted className="block text-sm">Notify users about order updates</Muted>
                </div>
                <Switch
                  id="orderNotifications"
                  checked={settings.notifications.orderNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, orderNotifications: checked },
                    })
                  }
                />
              </div>
              <Button onClick={() => handleSave('notifications')}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure platform security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <Muted className="block text-sm">Users must verify their email address</Muted>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={settings.security.requireEmailVerification}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, requireEmailVerification: checked },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableMFA">Enable Multi-Factor Authentication</Label>
                  <Muted className="block text-sm">Allow users to enable MFA</Muted>
                </div>
                <Switch
                  id="enableMFA"
                  checked={settings.security.enableMFA}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, enableMFA: checked },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          sessionTimeout: parseInt(e.target.value) || 30,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          maxLoginAttempts: parseInt(e.target.value) || 5,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <Button onClick={() => handleSave('security')}>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(settings.features).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={key} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                  </div>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        features: { ...settings.features, [key]: checked },
                      })
                    }
                  />
                </div>
              ))}
              <Button onClick={() => handleSave('features')}>
                <Save className="h-4 w-4 mr-2" />
                Save Feature Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsPage;

