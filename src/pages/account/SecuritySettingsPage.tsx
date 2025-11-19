import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Smartphone,
  Mail,
  Key,
  Fingerprint,
  Eye,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  AlertTriangle,
  FileText,
  Download,
  Lock,
  Globe,
  Clock,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import MFAForm from '@/components/MFAForm';
import BiometricAuthButton from '@/components/BiometricAuthButton';
import ActivityLogCard from '@/components/security/ActivityLogCard';
import DeviceCard from '@/components/security/DeviceCard';

interface SecurityMethod {
  id: string;
  type: 'sms' | 'email' | 'authenticator' | 'biometric';
  label: string;
  value: string;
  isVerified: boolean;
  isPrimary: boolean;
}

const SecuritySettingsPage: React.FC = () => {
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [showMFAForm, setShowMFAForm] = useState(false);
  const [showAddMethodDialog, setShowAddMethodDialog] = useState(false);
  const [selectedMFAMethod, setSelectedMFAMethod] = useState<'sms' | 'email' | 'authenticator'>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const [securityMethods, setSecurityMethods] = useState<SecurityMethod[]>([
    {
      id: 'email1',
      type: 'email',
      label: 'Email',
      value: 'user@example.com',
      isVerified: true,
      isPrimary: true,
    },
    {
      id: 'phone1',
      type: 'sms',
      label: 'Phone',
      value: '+1 (555) 123-4567',
      isVerified: true,
      isPrimary: false,
    },
  ]);

  const [linkedAccounts, setLinkedAccounts] = useState([
    { provider: 'Google', email: 'user@gmail.com', connected: true },
    { provider: 'Apple', email: 'user@icloud.com', connected: false },
    { provider: 'Facebook', email: 'user@facebook.com', connected: false },
  ]);

  const [devices, setDevices] = useState([
    {
      id: 'device1',
      name: 'MacBook Pro',
      type: 'laptop' as const,
      os: 'macOS 14.0',
      browser: 'Chrome 120',
      ipAddress: '192.168.1.100',
      location: 'New York, US',
      lastActive: new Date().toISOString(),
      isCurrent: true,
      isTrusted: true,
    },
    {
      id: 'device2',
      name: 'iPhone 15 Pro',
      type: 'mobile' as const,
      os: 'iOS 17.2',
      browser: 'Safari',
      ipAddress: '192.168.1.101',
      location: 'New York, US',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isCurrent: false,
      isTrusted: true,
    },
    {
      id: 'device3',
      name: 'Windows PC',
      type: 'desktop' as const,
      os: 'Windows 11',
      browser: 'Edge 120',
      ipAddress: '203.0.113.45',
      location: 'Los Angeles, US',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isCurrent: false,
      isTrusted: false,
    },
  ]);

  const [activityLog, setActivityLog] = useState([
    {
      id: 'act1',
      type: 'login' as const,
      description: 'Successful login from MacBook Pro',
      ipAddress: '192.168.1.100',
      location: 'New York, US',
      device: 'MacBook Pro',
      browser: 'Chrome 120',
      timestamp: new Date().toISOString(),
      status: 'success' as const,
    },
    {
      id: 'act2',
      type: 'password_change' as const,
      description: 'Password changed successfully',
      ipAddress: '192.168.1.100',
      location: 'New York, US',
      device: 'MacBook Pro',
      browser: 'Chrome 120',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'success' as const,
    },
    {
      id: 'act3',
      type: 'mfa_enabled' as const,
      description: 'Two-factor authentication enabled',
      ipAddress: '192.168.1.100',
      location: 'New York, US',
      device: 'MacBook Pro',
      browser: 'Chrome 120',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'success' as const,
    },
    {
      id: 'act4',
      type: 'login' as const,
      description: 'Failed login attempt',
      ipAddress: '203.0.113.45',
      location: 'Los Angeles, US',
      device: 'Windows PC',
      browser: 'Edge 120',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'failed' as const,
    },
    {
      id: 'act5',
      type: 'device_added' as const,
      description: 'New device added: iPhone 15 Pro',
      ipAddress: '192.168.1.101',
      location: 'New York, US',
      device: 'iPhone 15 Pro',
      browser: 'Safari',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'success' as const,
    },
  ]);

  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    analytics: true,
    marketing: false,
    thirdParty: false,
    profileVisibility: 'private' as 'public' | 'private' | 'friends',
  });

  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
    toast.success('Device removed successfully');
  };

  const handleTrustDevice = (deviceId: string) => {
    setDevices(devices.map(d => d.id === deviceId ? { ...d, isTrusted: true } : d));
    toast.success('Device marked as trusted');
  };

  const handleExportData = () => {
    toast.info('Preparing your data export... This may take a few minutes.');
    // In real app, this would trigger a data export process
    setTimeout(() => {
      toast.success('Data export ready! Check your email for download link.');
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requires additional verification. Please contact support.');
  };

  const handleEnableMFA = () => {
    if (!isMFAEnabled) {
      setShowMFAForm(true);
    } else {
      setIsMFAEnabled(false);
      toast.success('Two-factor authentication disabled');
    }
  };

  const handleMFAVerify = (code: string, method: string) => {
    // Verify MFA code
    toast.success('Two-factor authentication enabled successfully!');
    setIsMFAEnabled(true);
    setShowMFAForm(false);
  };

  const handleAddSecurityMethod = () => {
    if (selectedMFAMethod === 'sms' && !phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }
    if (selectedMFAMethod === 'email' && !email) {
      toast.error('Please enter an email address');
      return;
    }

    const newMethod: SecurityMethod = {
      id: `method-${Date.now()}`,
      type: selectedMFAMethod,
      label: selectedMFAMethod === 'sms' ? 'Phone' : selectedMFAMethod === 'email' ? 'Email' : 'Authenticator',
      value: selectedMFAMethod === 'sms' ? phoneNumber : email,
      isVerified: false,
      isPrimary: false,
    };

    setSecurityMethods([...securityMethods, newMethod]);
    setShowAddMethodDialog(false);
    setPhoneNumber('');
    setEmail('');
    toast.success('Security method added. Please verify it.');
  };

  const handleRemoveMethod = (id: string) => {
    setSecurityMethods(securityMethods.filter((m) => m.id !== id));
    toast.success('Security method removed');
  };

  const handleVerifyMethod = (id: string) => {
    setSecurityMethods(
      securityMethods.map((m) => (m.id === id ? { ...m, isVerified: true } : m))
    );
    toast.success('Security method verified');
  };

  const handleToggleBiometric = () => {
    if (!isBiometricEnabled) {
      // Show biometric setup
      toast.info('Setting up biometric authentication...');
      setTimeout(() => {
        setIsBiometricEnabled(true);
        toast.success('Biometric authentication enabled');
      }, 1000);
    } else {
      setIsBiometricEnabled(false);
      toast.success('Biometric authentication disabled');
    }
  };

  const handleSocialLoginSuccess = (provider: string, data: any) => {
    setLinkedAccounts(
      linkedAccounts.map((acc) =>
        acc.provider === provider ? { ...acc, connected: true, email: data.email } : acc
      )
    );
  };

  const handleDisconnectAccount = (provider: string) => {
    setLinkedAccounts(
      linkedAccounts.map((acc) =>
        acc.provider === provider ? { ...acc, connected: false } : acc
      )
    );
    toast.success(`${provider} account disconnected`);
  };

  return (
    <div className="space-y-8">
      <div>
        <H1>Security & Privacy</H1>
        <P className="text-muted-foreground">
          Manage your account security, privacy settings, and compliance preferences
        </P>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-8">

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </div>
            <Switch checked={isMFAEnabled} onCheckedChange={handleEnableMFA} />
          </div>
        </CardHeader>
        {isMFAEnabled && (
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <P className="text-sm font-semibold">Two-factor authentication is enabled</P>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <P className="text-sm font-semibold">Security Methods</P>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddMethodDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </div>
              {securityMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {method.type === 'sms' && <Smartphone className="h-5 w-5 text-muted-foreground" />}
                    {method.type === 'email' && <Mail className="h-5 w-5 text-muted-foreground" />}
                    {method.type === 'authenticator' && <Key className="h-5 w-5 text-muted-foreground" />}
                    <div>
                      <P className="text-sm font-semibold">{method.label}</P>
                      <Muted className="text-xs">{method.value}</Muted>
                    </div>
                    {method.isPrimary && (
                      <Badge variant="outline" className="text-xs">Primary</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isVerified ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">Verified</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerifyMethod(method.id)}
                      >
                        Verify
                      </Button>
                    )}
                    {!method.isPrimary && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMethod(method.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Biometric Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Biometric Authentication
              </CardTitle>
              <CardDescription>
                Use fingerprint, Face ID, or voice recognition for quick login
              </CardDescription>
            </div>
            <Switch checked={isBiometricEnabled} onCheckedChange={handleToggleBiometric} />
          </div>
        </CardHeader>
        {isBiometricEnabled && (
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <P className="text-sm font-semibold">Biometric authentication is enabled</P>
            </div>
            <div className="flex gap-2">
              <BiometricAuthButton type="fingerprint" />
              <BiometricAuthButton type="face" />
              <BiometricAuthButton type="voice" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Manage your social login connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {linkedAccounts.map((account) => (
            <div
              key={account.provider}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <P className="font-semibold">{account.provider}</P>
                <Muted className="text-sm">{account.email}</Muted>
              </div>
              <div className="flex items-center gap-2">
                {account.connected ? (
                  <>
                    <Badge variant="default">Connected</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectAccount(account.provider)}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Trigger social login
                      handleSocialLoginSuccess(account.provider, { email: account.email });
                    }}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Account Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Account Verification
          </CardTitle>
          <CardDescription>
            Verify your account to unlock additional features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <P className="text-sm font-semibold">Email Verification</P>
                  <Muted className="text-xs">Verify your email address</Muted>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Verified</Badge>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <P className="text-sm font-semibold">Phone Verification</P>
                  <Muted className="text-xs">Verify your phone number</Muted>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Verified</Badge>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <P className="text-sm font-semibold">KYC Verification</P>
                  <Muted className="text-xs">Required for high-value transactions</Muted>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Start Verification
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Security Alerts
              </CardTitle>
              <CardDescription>
                Configure how you receive security notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <P className="text-sm font-semibold">Email Notifications</P>
                  <Muted className="text-xs">Receive security alerts via email</Muted>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <P className="text-sm font-semibold">SMS Notifications</P>
                  <Muted className="text-xs">Receive security alerts via SMS</Muted>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <P className="text-sm font-semibold">Push Notifications</P>
                  <Muted className="text-xs">Receive security alerts via push notifications</Muted>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Active Devices
              </CardTitle>
              <CardDescription>
                Manage devices that have access to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onRemove={() => handleRemoveDevice(device.id)}
                  onTrust={() => handleTrustDevice(device.id)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Security Activity Log
              </CardTitle>
              <CardDescription>
                View all security-related activities on your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activity..."
                  className="pl-10"
                />
              </div>
              <div className="space-y-3">
                {activityLog.map((activity) => (
                  <ActivityLogCard key={activity.id} activity={activity} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-8">
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <P className="text-sm font-semibold">Data Sharing</P>
                  <Muted className="text-xs">Allow sharing of anonymized data for platform improvement</Muted>
                </div>
                <Switch
                  checked={privacySettings.dataSharing}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, dataSharing: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <P className="text-sm font-semibold">Analytics</P>
                  <Muted className="text-xs">Help us improve by sharing usage analytics</Muted>
                </div>
                <Switch
                  checked={privacySettings.analytics}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, analytics: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <P className="text-sm font-semibold">Marketing Communications</P>
                  <Muted className="text-xs">Receive marketing emails and promotions</Muted>
                </div>
                <Switch
                  checked={privacySettings.marketing}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, marketing: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <P className="text-sm font-semibold">Third-Party Sharing</P>
                  <Muted className="text-xs">Allow sharing data with trusted partners</Muted>
                </div>
                <Switch
                  checked={privacySettings.thirdParty}
                  onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, thirdParty: checked })}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={privacySettings.profileVisibility}
                  onValueChange={(value: any) => setPrivacySettings({ ...privacySettings, profileVisibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Export or delete your account data (GDPR compliant)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <P className="text-sm font-semibold">Export Your Data</P>
                    <Muted className="text-xs">Download a copy of all your account data</Muted>
                  </div>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50">
                  <div>
                    <P className="text-sm font-semibold text-destructive">Delete Account</P>
                    <Muted className="text-xs">Permanently delete your account and all data</Muted>
                  </div>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance & Regulations
              </CardTitle>
              <CardDescription>
                Your rights under GDPR, CCPA, and other privacy regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-muted rounded-lg">
                  <P className="text-sm font-semibold mb-2">GDPR Compliance</P>
                  <Muted className="text-sm">
                    You have the right to access, rectify, erase, restrict processing, 
                    data portability, and object to processing of your personal data.
                  </Muted>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <P className="text-sm font-semibold mb-2">CCPA Compliance</P>
                  <Muted className="text-sm">
                    California residents have the right to know, delete, and opt-out 
                    of the sale of personal information.
                  </Muted>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <P>Your data is encrypted and stored securely</P>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <P>We comply with international privacy regulations</P>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MFA Setup Dialog */}
      {showMFAForm && (
        <Dialog open={showMFAForm} onOpenChange={setShowMFAForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Choose your preferred verification method
              </DialogDescription>
            </DialogHeader>
            <MFAForm
              onVerify={handleMFAVerify}
              method={selectedMFAMethod}
              phoneNumber={phoneNumber}
              email={email}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Add Security Method Dialog */}
      <Dialog open={showAddMethodDialog} onOpenChange={setShowAddMethodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Security Method</DialogTitle>
            <DialogDescription>
              Add a new method for two-factor authentication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Method Type</Label>
              <Select
                value={selectedMFAMethod}
                onValueChange={(value: any) => setSelectedMFAMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="authenticator">Authenticator App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedMFAMethod === 'sms' && (
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            )}
            {selectedMFAMethod === 'email' && (
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            {selectedMFAMethod === 'authenticator' && (
              <div className="bg-muted p-4 rounded-lg">
                <P className="text-sm font-semibold mb-2">Authenticator App</P>
                <Muted className="text-sm">
                  Use an authenticator app like Google Authenticator or Authy to generate verification codes.
                </Muted>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMethodDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSecurityMethod}>Add Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySettingsPage;

