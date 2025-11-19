import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, Upload, Palette, Layout, Globe, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const VendorStorefrontPage: React.FC = () => {
  const [storefront, setStorefront] = useState({
    // Branding
    storeName: 'Luxury Boutique',
    tagline: 'Curated luxury for the discerning',
    logo: '',
    coverImage: '',
    primaryColor: '#D4AF37',
    secondaryColor: '#1A1A1A',
    
    // Layout
    layoutStyle: 'modern' as 'modern' | 'classic' | 'minimal',
    showBanner: true,
    bannerText: 'Welcome to our store!',
    featuredProductsCount: 6,
    
    // Content
    description: 'We specialize in bringing you the finest luxury products from around the world.',
    story: 'Founded in 2020, we have been committed to curating exceptional luxury items.',
    contactEmail: 'contact@luxuryboutique.com',
    contactPhone: '+1 (555) 123-4567',
    website: 'https://www.luxuryboutique.com',
    
    // Social Media
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: '',
      pinterest: '',
    },
    
    // Settings
    enableReviews: true,
    enableLiveChat: true,
    enableNewsletter: false,
    customDomain: '',
  });

  const handleSave = () => {
    // In real app, this would save to backend
    localStorage.setItem('vendor_storefront', JSON.stringify(storefront));
    toast.success('Storefront settings saved!');
  };

  const handleImageUpload = (type: 'logo' | 'cover') => {
    // In real app, this would upload to cloud storage
    toast.info('Image upload functionality would be implemented here');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Storefront Customization</H1>
          <P className="text-muted-foreground">Customize your vendor storefront appearance and settings</P>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList>
          <TabsTrigger value="branding">
            <Palette className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="content">
            <Globe className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="social">
            <ImageIcon className="h-4 w-4 mr-2" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Globe className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Branding</CardTitle>
              <CardDescription>Customize your store's visual identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={storefront.storeName}
                  onChange={(e) => setStorefront({ ...storefront, storeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={storefront.tagline}
                  onChange={(e) => setStorefront({ ...storefront, tagline: e.target.value })}
                  placeholder="A short description of your store"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Store Logo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={() => handleImageUpload('logo')}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => document.getElementById('logo')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                  {storefront.logo && (
                    <div className="mt-2">
                      <img src={storefront.logo} alt="Logo" className="h-20 w-auto" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={() => handleImageUpload('cover')}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => document.getElementById('coverImage')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Cover
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={storefront.primaryColor}
                      onChange={(e) => setStorefront({ ...storefront, primaryColor: e.target.value })}
                      className="h-10 w-20"
                    />
                    <Input
                      value={storefront.primaryColor}
                      onChange={(e) => setStorefront({ ...storefront, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={storefront.secondaryColor}
                      onChange={(e) => setStorefront({ ...storefront, secondaryColor: e.target.value })}
                      className="h-10 w-20"
                    />
                    <Input
                      value={storefront.secondaryColor}
                      onChange={(e) => setStorefront({ ...storefront, secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Customize your storefront layout and display</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="layoutStyle">Layout Style</Label>
                <Select
                  value={storefront.layoutStyle}
                  onValueChange={(value: any) => setStorefront({ ...storefront, layoutStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showBanner">Show Banner</Label>
                  <Muted className="block text-sm">Display a banner at the top of your store</Muted>
                </div>
                <Switch
                  id="showBanner"
                  checked={storefront.showBanner}
                  onCheckedChange={(checked) => setStorefront({ ...storefront, showBanner: checked })}
                />
              </div>
              {storefront.showBanner && (
                <div className="space-y-2">
                  <Label htmlFor="bannerText">Banner Text</Label>
                  <Input
                    id="bannerText"
                    value={storefront.bannerText}
                    onChange={(e) => setStorefront({ ...storefront, bannerText: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="featuredProductsCount">Featured Products Count</Label>
                <Select
                  value={storefront.featuredProductsCount.toString()}
                  onValueChange={(value) =>
                    setStorefront({ ...storefront, featuredProductsCount: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Products</SelectItem>
                    <SelectItem value="6">6 Products</SelectItem>
                    <SelectItem value="9">9 Products</SelectItem>
                    <SelectItem value="12">12 Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Content</CardTitle>
              <CardDescription>Add information about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Store Description *</Label>
                <Textarea
                  id="description"
                  value={storefront.description}
                  onChange={(e) => setStorefront({ ...storefront, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story">Our Story</Label>
                <Textarea
                  id="story"
                  value={storefront.story}
                  onChange={(e) => setStorefront({ ...storefront, story: e.target.value })}
                  rows={5}
                  placeholder="Tell customers about your brand's history and mission"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={storefront.contactEmail}
                    onChange={(e) => setStorefront({ ...storefront, contactEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={storefront.contactPhone}
                    onChange={(e) => setStorefront({ ...storefront, contactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={storefront.website}
                  onChange={(e) => setStorefront({ ...storefront, website: e.target.value })}
                  placeholder="https://www.yourwebsite.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={storefront.socialMedia.instagram}
                  onChange={(e) =>
                    setStorefront({
                      ...storefront,
                      socialMedia: { ...storefront.socialMedia, instagram: e.target.value },
                    })
                  }
                  placeholder="@yourhandle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={storefront.socialMedia.facebook}
                  onChange={(e) =>
                    setStorefront({
                      ...storefront,
                      socialMedia: { ...storefront.socialMedia, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={storefront.socialMedia.twitter}
                  onChange={(e) =>
                    setStorefront({
                      ...storefront,
                      socialMedia: { ...storefront.socialMedia, twitter: e.target.value },
                    })
                  }
                  placeholder="@yourhandle"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinterest">Pinterest</Label>
                <Input
                  id="pinterest"
                  value={storefront.socialMedia.pinterest}
                  onChange={(e) =>
                    setStorefront({
                      ...storefront,
                      socialMedia: { ...storefront.socialMedia, pinterest: e.target.value },
                    })
                  }
                  placeholder="https://pinterest.com/yourprofile"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Configure storefront features and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableReviews">Enable Reviews</Label>
                  <Muted className="block text-sm">Allow customers to leave product reviews</Muted>
                </div>
                <Switch
                  id="enableReviews"
                  checked={storefront.enableReviews}
                  onCheckedChange={(checked) => setStorefront({ ...storefront, enableReviews: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableLiveChat">Enable Live Chat</Label>
                  <Muted className="block text-sm">Allow customers to chat with you in real-time</Muted>
                </div>
                <Switch
                  id="enableLiveChat"
                  checked={storefront.enableLiveChat}
                  onCheckedChange={(checked) => setStorefront({ ...storefront, enableLiveChat: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNewsletter">Enable Newsletter Signup</Label>
                  <Muted className="block text-sm">Show newsletter signup form on storefront</Muted>
                </div>
                <Switch
                  id="enableNewsletter"
                  checked={storefront.enableNewsletter}
                  onCheckedChange={(checked) => setStorefront({ ...storefront, enableNewsletter: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                <Input
                  id="customDomain"
                  value={storefront.customDomain}
                  onChange={(e) => setStorefront({ ...storefront, customDomain: e.target.value })}
                  placeholder="store.yourdomain.com"
                />
                <Muted className="text-sm">Contact support to configure custom domain</Muted>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorStorefrontPage;

