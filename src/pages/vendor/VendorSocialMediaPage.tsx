import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Instagram, Facebook, Twitter, Linkedin, CheckCircle, XCircle, Link2, TrendingUp, Users, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import VendorMetricsCard from '@/components/vendor/VendorMetricsCard';

interface SocialAccount {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin';
  accountName: string;
  isConnected: boolean;
  connectedAt?: string;
  autoPost: boolean;
}

interface AutoPostRule {
  id: string;
  name: string;
  trigger: 'new_product' | 'sale' | 'promotion' | 'manual';
  platforms: string[];
  template: string;
  isActive: boolean;
}

const VendorSocialMediaPage: React.FC = () => {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      id: 'sa1',
      platform: 'instagram',
      accountName: '@luxuryboutique',
      isConnected: true,
      connectedAt: '2023-10-15',
      autoPost: true,
    },
    {
      id: 'sa2',
      platform: 'facebook',
      accountName: 'Luxury Boutique',
      isConnected: true,
      connectedAt: '2023-10-15',
      autoPost: false,
    },
    {
      id: 'sa3',
      platform: 'twitter',
      accountName: '@luxuryboutique',
      isConnected: false,
      autoPost: false,
    },
    {
      id: 'sa4',
      platform: 'linkedin',
      accountName: 'Luxury Boutique',
      isConnected: false,
      autoPost: false,
    },
  ]);

  const [autoPostRules, setAutoPostRules] = useState<AutoPostRule[]>([
    {
      id: 'rule1',
      name: 'New Product Launch',
      trigger: 'new_product',
      platforms: ['instagram', 'facebook'],
      template: 'Check out our new {product_name}! {product_url}',
      isActive: true,
    },
    {
      id: 'rule2',
      name: 'Sale Announcement',
      trigger: 'sale',
      platforms: ['instagram', 'facebook', 'twitter'],
      template: '🎉 Sale Alert! {sale_description} Use code: {promo_code}',
      isActive: true,
    },
  ]);

  const getPlatformIcon = (platform: SocialAccount['platform']) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: SocialAccount['platform']) => {
    switch (platform) {
      case 'instagram':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'facebook':
        return 'bg-blue-600';
      case 'twitter':
        return 'bg-sky-500';
      case 'linkedin':
        return 'bg-blue-700';
    }
  };

  const handleConnect = (account: SocialAccount) => {
    // In real app, this would open OAuth flow
    setSocialAccounts((prev) =>
      prev.map((a) =>
        a.id === account.id
          ? {
              ...a,
              isConnected: true,
              connectedAt: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );
    toast.success(`${account.platform} account connected!`);
  };

  const handleDisconnect = (account: SocialAccount) => {
    setSocialAccounts((prev) =>
      prev.map((a) =>
        a.id === account.id
          ? { ...a, isConnected: false, autoPost: false, connectedAt: undefined }
          : a
      )
    );
    toast.success(`${account.platform} account disconnected`);
  };

  const handleToggleAutoPost = (accountId: string) => {
    setSocialAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, autoPost: !a.autoPost } : a))
    );
  };

  const handleToggleRule = (ruleId: string) => {
    setAutoPostRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const socialMetrics = useMemo(() => {
    const connectedAccounts = socialAccounts.filter(a => a.isConnected).length;
    const activeAutoPost = socialAccounts.filter(a => a.isConnected && a.autoPost).length;
    const activeRules = autoPostRules.filter(r => r.isActive).length;
    
    return {
      connectedAccounts,
      activeAutoPost,
      activeRules,
    };
  }, [socialAccounts, autoPostRules]);

  return (
    <div className="space-y-8">
      <div>
        <H1>Social Media Integration</H1>
        <P className="text-muted-foreground">
          Connect your social media accounts and automate posting
        </P>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <VendorMetricsCard
          title="Connected Accounts"
          value={socialMetrics.connectedAccounts}
          icon={Link2}
          description="Social accounts"
        />
        <VendorMetricsCard
          title="Auto-Post Enabled"
          value={socialMetrics.activeAutoPost}
          icon={Share2}
          description="Accounts with auto-post"
        />
        <VendorMetricsCard
          title="Active Rules"
          value={socialMetrics.activeRules}
          icon={TrendingUp}
          description="Auto-post rules"
        />
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your social media account connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {socialAccounts.map((account) => (
              <Card key={account.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`${getPlatformColor(account.platform)} p-3 rounded-lg text-white`}
                      >
                        {getPlatformIcon(account.platform)}
                      </div>
                      <div>
                        <P className="font-semibold capitalize">{account.platform}</P>
                        <Muted className="text-sm">{account.accountName}</Muted>
                      </div>
                    </div>
                    {account.isConnected ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not Connected</Badge>
                    )}
                  </div>
                  {account.isConnected && (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`auto-${account.id}`} className="text-sm">
                          Auto-post enabled
                        </Label>
                        <Switch
                          id={`auto-${account.id}`}
                          checked={account.autoPost}
                          onCheckedChange={() => handleToggleAutoPost(account.id)}
                        />
                      </div>
                      {account.connectedAt && (
                        <Muted className="text-xs">
                          Connected on {new Date(account.connectedAt).toLocaleDateString()}
                        </Muted>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(account)}
                        className="w-full"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    </div>
                  )}
                  {!account.isConnected && (
                    <Button
                      onClick={() => handleConnect(account)}
                      className="w-full mt-4"
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect Account
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Post Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Post Rules</CardTitle>
          <CardDescription>
            Automatically post to social media when certain events occur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {autoPostRules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <P className="font-semibold">{rule.name}</P>
                        <Badge variant="outline" className="capitalize">
                          {rule.trigger.replace('_', ' ')}
                        </Badge>
                        {rule.isActive && (
                          <Badge variant="default">Active</Badge>
                        )}
                      </div>
                      <Muted className="text-sm mb-2 block">
                        Platforms: {rule.platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}
                      </Muted>
                      <div className="bg-muted p-3 rounded-lg">
                        <Muted className="text-xs mb-1 block">Template:</Muted>
                        <P className="text-sm font-mono">{rule.template}</P>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="mt-4">
            <Link2 className="h-4 w-4 mr-2" />
            Create New Rule
          </Button>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Your recent social media posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-purple-500" />
                <div>
                  <P className="font-semibold">New Collection Launch</P>
                  <Muted className="text-sm">Posted 2 hours ago</Muted>
                </div>
              </div>
              <Badge variant="default">Published</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-blue-600" />
                <div>
                  <P className="font-semibold">Holiday Sale Announcement</P>
                  <Muted className="text-sm">Posted 1 day ago</Muted>
                </div>
              </div>
              <Badge variant="default">Published</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorSocialMediaPage;

