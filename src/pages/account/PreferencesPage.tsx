import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Palette, Ruler, Bell, Globe, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const PreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    style: {
      favoriteColors: [] as string[],
      preferredStyles: [] as string[],
      sizePreferences: {} as Record<string, string>,
      bodyType: '',
      occasionPreferences: [] as string[],
    },
    notifications: {
      email: {
        orderUpdates: true,
        promotions: true,
        newArrivals: false,
        priceDrops: true,
        backInStock: true,
      },
      push: {
        orderUpdates: true,
        promotions: false,
        newArrivals: false,
        priceDrops: true,
      },
      sms: {
        orderUpdates: false,
        promotions: false,
      },
    },
    account: {
      language: 'en',
      currency: 'USD',
      theme: 'system',
      timezone: 'UTC',
    },
  });

  const colors = ['Black', 'White', 'Navy', 'Beige', 'Gray', 'Red', 'Blue', 'Green', 'Pink', 'Brown'];
  const styles = ['Minimalist', 'Classic', 'Bohemian', 'Streetwear', 'Formal', 'Casual', 'Vintage', 'Modern'];
  const occasions = ['Work', 'Casual', 'Formal', 'Party', 'Wedding', 'Travel', 'Sport', 'Beach'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const categories = ['Dresses', 'Outerwear', 'Accessories', 'Footwear', 'Bags'];

  const handleSave = () => {
    // In real app, this would save to backend
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
    toast.success('Preferences saved successfully!');
  };

  const toggleColor = (color: string) => {
    setPreferences((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        favoriteColors: prev.style.favoriteColors.includes(color)
          ? prev.style.favoriteColors.filter((c) => c !== color)
          : [...prev.style.favoriteColors, color],
      },
    }));
  };

  const toggleStyle = (style: string) => {
    setPreferences((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        preferredStyles: prev.style.preferredStyles.includes(style)
          ? prev.style.preferredStyles.filter((s) => s !== style)
          : [...prev.style.preferredStyles, style],
      },
    }));
  };

  const toggleOccasion = (occasion: string) => {
    setPreferences((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        occasionPreferences: prev.style.occasionPreferences.includes(occasion)
          ? prev.style.occasionPreferences.filter((o) => o !== occasion)
          : [...prev.style.occasionPreferences, occasion],
      },
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Preferences & Settings</H1>
          <P className="text-muted-foreground">Customize your shopping experience</P>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>

      <Tabs defaultValue="style" className="w-full">
        <TabsList>
          <TabsTrigger value="style">
            <Palette className="h-4 w-4 mr-2" />
            Style Profile
          </TabsTrigger>
          <TabsTrigger value="sizes">
            <Ruler className="h-4 w-4 mr-2" />
            Size Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account">
            <Globe className="h-4 w-4 mr-2" />
            Account Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Style Preferences</CardTitle>
              <CardDescription>Help us recommend products that match your style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Favorite Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <Badge
                      key={color}
                      variant={preferences.style.favoriteColors.includes(color) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Styles</Label>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <Badge
                      key={style}
                      variant={preferences.style.preferredStyles.includes(style) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleStyle(style)}
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Shop For Occasions</Label>
                <div className="flex flex-wrap gap-2">
                  {occasions.map((occasion) => (
                    <Badge
                      key={occasion}
                      variant={preferences.style.occasionPreferences.includes(occasion) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleOccasion(occasion)}
                    >
                      {occasion}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyType">Body Type</Label>
                <Select
                  value={preferences.style.bodyType}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      style: { ...prev.style, bodyType: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petite">Petite</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="tall">Tall</SelectItem>
                    <SelectItem value="curvy">Curvy</SelectItem>
                    <SelectItem value="athletic">Athletic</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sizes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Size Profile</CardTitle>
              <CardDescription>Save your sizes for different categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((category) => (
                <div key={category} className="space-y-2">
                  <Label>{category}</Label>
                  <Select
                    value={preferences.style.sizePreferences[category] || ''}
                    onValueChange={(value) =>
                      setPreferences((prev) => ({
                        ...prev,
                        style: {
                          ...prev.style,
                          sizePreferences: {
                            ...prev.style.sizePreferences,
                            [category]: value,
                          },
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select size for ${category}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(preferences.notifications.email).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          email: { ...prev.notifications.email, [key]: checked },
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(preferences.notifications.push).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          push: { ...prev.notifications.push, [key]: checked },
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(preferences.notifications.sms).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  </div>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          sms: { ...prev.notifications.sms, [key]: checked },
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.account.language}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      account: { ...prev.account, language: value },
                    }))
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
                    <SelectItem value="it">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={preferences.account.currency}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      account: { ...prev.account, currency: value },
                    }))
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
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences.account.theme}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      account: { ...prev.account, theme: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={preferences.account.timezone}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({
                      ...prev,
                      account: { ...prev.account, timezone: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreferencesPage;

