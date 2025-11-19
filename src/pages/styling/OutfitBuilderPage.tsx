import React, { useState, useMemo } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Save, 
  Share2, 
  Download, 
  ShoppingBag, 
  Heart,
  Calendar,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { Link } from 'react-router-dom';

interface OutfitItem {
  id: string;
  productId: string;
  category: string;
  name: string;
  image: string;
  price: number;
}

interface Outfit {
  id: string;
  name: string;
  description?: string;
  occasion?: string;
  season?: string;
  items: OutfitItem[];
  createdAt: string;
  image?: string;
}

const OutfitBuilderPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [outfitDescription, setOutfitDescription] = useState('');
  const [outfitOccasion, setOutfitOccasion] = useState('');
  const [outfitSeason, setOutfitSeason] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Dresses', 'Outerwear', 'Accessories', 'Footwear', 'Bags'];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCreateOutfit = () => {
    setIsCreating(true);
    setCurrentOutfit({
      id: `outfit-${Date.now()}`,
      name: 'New Outfit',
      items: [],
      createdAt: new Date().toISOString(),
    });
    setOutfitName('');
    setOutfitDescription('');
    setOutfitOccasion('');
    setOutfitSeason('');
  };

  const handleAddItem = (product: typeof products[0]) => {
    if (!currentOutfit) return;

    const category = product.category;
    const existingItem = currentOutfit.items.find(item => item.category === category);
    
    if (existingItem) {
      toast.info(`You already have a ${category.toLowerCase()} item. Replace it?`);
      // Replace existing item
      setCurrentOutfit({
        ...currentOutfit,
        items: currentOutfit.items.map(item =>
          item.category === category
            ? {
                id: `item-${Date.now()}`,
                productId: product.id,
                category,
                name: product.name,
                image: product.images[0],
                price: product.price,
              }
            : item
        ),
      });
    } else {
      // Add new item
      setCurrentOutfit({
        ...currentOutfit,
        items: [
          ...currentOutfit.items,
          {
            id: `item-${Date.now()}`,
            productId: product.id,
            category,
            name: product.name,
            image: product.images[0],
            price: product.price,
          },
        ],
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (!currentOutfit) return;
    setCurrentOutfit({
      ...currentOutfit,
      items: currentOutfit.items.filter(item => item.id !== itemId),
    });
  };

  const handleSaveOutfit = () => {
    if (!currentOutfit || !outfitName.trim()) {
      toast.error('Please enter an outfit name');
      return;
    }

    const savedOutfit: Outfit = {
      ...currentOutfit,
      name: outfitName,
      description: outfitDescription,
      occasion: outfitOccasion,
      season: outfitSeason,
    };

    setOutfits([...outfits, savedOutfit]);
    localStorage.setItem('saved_outfits', JSON.stringify([...outfits, savedOutfit]));
    toast.success('Outfit saved!');
    setIsCreating(false);
    setCurrentOutfit(null);
    setOutfitName('');
    setOutfitDescription('');
    setOutfitOccasion('');
    setOutfitSeason('');
  };

  const handleDeleteOutfit = (outfitId: string) => {
    setOutfits(outfits.filter(o => o.id !== outfitId));
    localStorage.setItem('saved_outfits', JSON.stringify(outfits.filter(o => o.id !== outfitId)));
    toast.success('Outfit deleted');
  };

  const getTotalPrice = (items: OutfitItem[]) => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('saved_outfits');
    if (saved) {
      setOutfits(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <H1>Outfit Builder</H1>
          <P className="text-muted-foreground">Create and save complete outfits from your favorite products</P>
        </div>
        <Button onClick={handleCreateOutfit}>
          <Plus className="h-4 w-4 mr-2" />
          Create Outfit
        </Button>
      </div>

      {isCreating && currentOutfit && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Building Your Outfit</CardTitle>
            <CardDescription>Add items from different categories to create a complete look</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="outfitName">Outfit Name *</Label>
                <Input
                  id="outfitName"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="e.g., Summer Casual Look"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfitOccasion">Occasion</Label>
                <Select value={outfitOccasion} onValueChange={setOutfitOccasion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfitSeason">Season</Label>
                <Select value={outfitSeason} onValueChange={setOutfitSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring">Spring</SelectItem>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="fall">Fall</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="all">All Seasons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfitDescription">Description</Label>
                <Textarea
                  id="outfitDescription"
                  value={outfitDescription}
                  onChange={(e) => setOutfitDescription(e.target.value)}
                  placeholder="Add notes about this outfit..."
                  rows={3}
                />
              </div>
            </div>

            {/* Current Outfit Items */}
            {currentOutfit.items.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <P className="font-semibold">Outfit Items ({currentOutfit.items.length})</P>
                  <P className="font-bold text-lg">
                    Total: {formatPrice(getTotalPrice(currentOutfit.items))}
                  </P>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {currentOutfit.items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="pt-4">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <P className="text-sm font-medium mb-1">{item.name}</P>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.category}</Badge>
                          <P className="text-sm font-semibold">{formatPrice(item.price)}</P>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Product Selection */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <P className="font-semibold">Add Products</P>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48"
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => {
                  const isInOutfit = currentOutfit.items.some(item => item.productId === product.id);
                  const categoryExists = currentOutfit.items.some(item => item.category === product.category);
                  return (
                    <Card
                      key={product.id}
                      className={`cursor-pointer hover:shadow-lg transition-shadow ${
                        isInOutfit ? 'border-primary' : ''
                      }`}
                      onClick={() => !isInOutfit && handleAddItem(product)}
                    >
                      <CardContent className="pt-4">
                        <div className="relative">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          {isInOutfit && (
                            <Badge className="absolute top-2 right-2">Added</Badge>
                          )}
                        </div>
                        <P className="text-sm font-medium mb-1 line-clamp-2">{product.name}</P>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                          <P className="text-sm font-semibold">{formatPrice(product.price)}</P>
                        </div>
                        {categoryExists && !isInOutfit && (
                          <Muted className="text-xs mt-1 block">
                            Replace existing {product.category.toLowerCase()}
                          </Muted>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => { setIsCreating(false); setCurrentOutfit(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSaveOutfit} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Outfit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Outfits */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <H1 className="text-2xl">Saved Outfits</H1>
          <Badge variant="outline">{outfits.length} outfits</Badge>
        </div>
        {outfits.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <P className="text-lg text-muted-foreground mb-2">No saved outfits yet</P>
              <P className="text-sm text-muted-foreground mb-4">
                Create your first outfit to get started
              </P>
              <Button onClick={handleCreateOutfit}>
                <Plus className="h-4 w-4 mr-2" />
                Create Outfit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {outfits.map((outfit) => (
              <Card key={outfit.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-1">{outfit.name}</CardTitle>
                      {outfit.description && (
                        <CardDescription className="line-clamp-2">{outfit.description}</CardDescription>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteOutfit(outfit.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {outfit.occasion && (
                      <Badge variant="secondary">{outfit.occasion}</Badge>
                    )}
                    {outfit.season && (
                      <Badge variant="outline">{outfit.season}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {outfit.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Badge className="absolute bottom-1 left-1 text-xs">{item.category}</Badge>
                      </div>
                    ))}
                  </div>
                  {outfit.items.length > 4 && (
                    <P className="text-sm text-muted-foreground text-center">
                      +{outfit.items.length - 4} more items
                    </P>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <P className="font-bold">{formatPrice(getTotalPrice(outfit.items))}</P>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <ShoppingBag className="h-3 w-3 mr-1" />
                        Shop
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutfitBuilderPage;

