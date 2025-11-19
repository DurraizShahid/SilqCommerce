import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Box, 
  RotateCw, 
  Move, 
  ZoomIn, 
  ZoomOut,
  Download,
  Share2,
  ShoppingCart,
  Grid3x3,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';

const ARFurniturePage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    return products.find(p => p.id === productId && p.category === 'Furniture') || products[0];
  });
  const [roomType, setRoomType] = useState('living-room');
  const [placementMode, setPlacementMode] = useState<'place' | 'move' | 'rotate'>('place');
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlaced, setIsPlaced] = useState(false);

  const handlePlace = () => {
    setIsPlaced(true);
    toast.success('Furniture placed! Use controls to adjust position.');
  };

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!isPlaced) {
      toast.error('Place the furniture first');
      return;
    }
    toast.info(`Moving ${direction}`);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    toast.info(`Rotated to ${rotation + 90}°`);
  };

  const handleScale = (delta: number) => {
    setScale((prev) => Math.max(0.5, Math.min(2, prev + delta)));
    toast.info(`Scale: ${((scale + delta) * 100).toFixed(0)}%`);
  };

  const handleCapture = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ar-furniture-${Date.now()}.png`;
          a.click();
          toast.success('Image saved!');
        }
      });
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    toast.success(`${selectedProduct.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="flex items-center gap-2">
            <Box className="h-8 w-8 text-primary" />
            AR Furniture Placement
          </H1>
          <P className="text-muted-foreground">
            See how {selectedProduct.name} looks in your space
          </P>
        </div>
        <Link to={`/products/${selectedProduct.id}`}>
          <Button variant="outline">View Product Details</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AR View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AR Room View</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="living-room">Living Room</SelectItem>
                      <SelectItem value="bedroom">Bedroom</SelectItem>
                      <SelectItem value="dining-room">Dining Room</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>
                Use your camera to place furniture in your space
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                {/* Room Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Grid3x3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <P className="text-lg">Room View</P>
                    <Muted className="text-sm">
                      {isPlaced ? 'Furniture placed' : 'Tap to place furniture'}
                    </Muted>
                  </div>
                </div>

                {/* Furniture Overlay */}
                {isPlaced && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                    }}
                  >
                    <div className="relative">
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="w-48 h-48 object-contain drop-shadow-2xl"
                      />
                      <Badge className="absolute -top-2 -right-2 bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Placed
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Placement Button */}
                {!isPlaced && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" onClick={handlePlace}>
                      <Box className="h-5 w-5 mr-2" />
                      Place Furniture
                    </Button>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Controls */}
              {isPlaced && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMove('up')}
                      >
                        ↑ Up
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMove('down')}
                      >
                        ↓ Down
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMove('left')}
                      >
                        ← Left
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMove('right')}
                      >
                        → Right
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Adjust</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRotate}
                        className="flex-1"
                      >
                        <RotateCw className="h-4 w-4 mr-1" />
                        Rotate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleScale(0.1)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleScale(-0.1)}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <P className="font-semibold text-lg">{selectedProduct.name}</P>
                <P className="text-2xl font-bold mt-2">{formatPrice(selectedProduct.price)}</P>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <Muted>Dimensions</Muted>
                  <P>120cm × 80cm × 45cm</P>
                </div>
                <div className="flex justify-between text-sm">
                  <Muted>Weight</Muted>
                  <P>25 kg</P>
                </div>
                <div className="flex justify-between text-sm">
                  <Muted>Material</Muted>
                  <P>Premium Wood</P>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button onClick={handleAddToCart} className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full" onClick={handleCapture}>
                  <Download className="h-4 w-4 mr-2" />
                  Save Image
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>AR Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Scan your room for best placement</li>
                <li>• Use rotate to see all angles</li>
                <li>• Adjust scale to match real size</li>
                <li>• Save image to compare options</li>
                <li>• Try different room types</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ARFurniturePage;

