import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Box, 
  Move, 
  RotateCw, 
  ZoomIn,
  ShoppingCart,
  Headphones,
  Monitor,
  Smartphone,
  Info,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const VirtualShowroomPage: React.FC = () => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [selectedShowroom, setSelectedShowroom] = useState('luxury-boutique');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'vr'>('desktop');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const showrooms = [
    {
      id: 'luxury-boutique',
      name: 'Luxury Boutique',
      description: 'Elegant high-end fashion showroom',
      image: '/api/placeholder/800/600',
    },
    {
      id: 'modern-minimalist',
      name: 'Modern Minimalist',
      description: 'Clean, contemporary design space',
      image: '/api/placeholder/800/600',
    },
    {
      id: 'vintage-collection',
      name: 'Vintage Collection',
      description: 'Classic and timeless pieces',
      image: '/api/placeholder/800/600',
    },
  ];

  const categories = ['all', 'Dresses', 'Outerwear', 'Accessories', 'Footwear', 'Bags'];

  const filteredProducts = selectedCategory === 'all' 
    ? products.slice(0, 8)
    : products.filter(p => p.category === selectedCategory).slice(0, 8);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" />
            Virtual Showroom
          </H1>
          <P className="text-muted-foreground">
            Explore our products in immersive 3D showrooms
          </P>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">
                <Monitor className="h-4 w-4 mr-2 inline" />
                Desktop
              </SelectItem>
              <SelectItem value="mobile">
                <Smartphone className="h-4 w-4 mr-2 inline" />
                Mobile
              </SelectItem>
              <SelectItem value="vr">
                <Headphones className="h-4 w-4 mr-2 inline" />
                VR Headset
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* VR Warning */}
      {viewMode === 'vr' && (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <P className="font-semibold mb-1">VR Mode</P>
                <Muted className="text-sm">
                  For the best VR experience, use a compatible VR headset. 
                  Desktop and mobile modes are available for all devices.
                </Muted>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Showroom View */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>3D Showroom</CardTitle>
                <Select value={selectedShowroom} onValueChange={setSelectedShowroom}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {showrooms.map(showroom => (
                      <SelectItem key={showroom.id} value={showroom.id}>
                        {showroom.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>
                {showrooms.find(s => s.id === selectedShowroom)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-300 rounded-lg overflow-hidden">
                {/* 3D Showroom View - In real implementation, this would be a WebGL/Three.js scene */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Box className="h-24 w-24 mx-auto mb-4 opacity-30" />
                    <P className="text-xl font-semibold mb-2">3D Virtual Showroom</P>
                    <Muted className="text-sm">
                      {viewMode === 'vr' 
                        ? 'VR experience would load here'
                        : 'Interactive 3D showroom view'}
                    </Muted>
                    {viewMode === 'vr' && (
                      <Badge className="mt-4 bg-purple-500">
                        <Headphones className="h-3 w-3 mr-1" />
                        VR Mode Active
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-2">
                    <Button variant="secondary" size="icon">
                      <Move className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products in Showroom */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Products in Showroom</CardTitle>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <P className="font-semibold text-sm line-clamp-1">{product.name}</P>
                    <P className="text-sm font-bold">{formatPrice(product.price)}</P>
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Showroom Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Muted className="text-xs">Current Showroom</Muted>
                <P className="font-semibold">
                  {showrooms.find(s => s.id === selectedShowroom)?.name}
                </P>
              </div>
              <div>
                <Muted className="text-xs">View Mode</Muted>
                <P className="font-semibold capitalize">{viewMode}</P>
              </div>
              <div>
                <Muted className="text-xs">Products</Muted>
                <P className="font-semibold">{filteredProducts.length} items</P>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Move className="h-4 w-4 mr-2" />
                Move
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RotateCw className="h-4 w-4 mr-2" />
                Rotate View
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use mouse/touch to navigate</li>
                <li>• Click products to view details</li>
                <li>• Switch showrooms for different styles</li>
                <li>• VR mode requires compatible headset</li>
                <li>• Products update in real-time</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VirtualShowroomPage;

