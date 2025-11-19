import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Camera, 
  RotateCcw, 
  Download, 
  Share2, 
  ShoppingCart,
  Maximize2,
  Settings,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';

const ARTryOnPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    return products.find(p => p.id === productId) || products[0];
  });
  const [selectedColor, setSelectedColor] = useState('default');
  const [selectedSize, setSelectedSize] = useState('M');
  const [arOpacity, setArOpacity] = useState([100]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    // Check camera permission
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setCameraPermission('granted');
      })
      .catch(() => {
        setCameraPermission('denied');
      });
  }, []);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        toast.success('Camera activated!');
      }
    } catch (error) {
      toast.error('Failed to access camera. Please check permissions.');
      setCameraPermission('denied');
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const handleCapture = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        // In real implementation, AR overlay would be drawn here
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ar-tryon-${Date.now()}.png`;
            a.click();
            toast.success('Image saved!');
          }
        });
      }
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct);
    toast.success(`${selectedProduct.name} added to cart!`);
  };

  const availableColors = ['Black', 'White', 'Red', 'Blue', 'Green'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="flex items-center gap-2">
            <Camera className="h-8 w-8 text-primary" />
            AR Try-On
          </H1>
          <P className="text-muted-foreground">
            Try on {selectedProduct.name} using augmented reality
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
                <CardTitle>AR Preview</CardTitle>
                <div className="flex items-center gap-2">
                  {cameraPermission === 'denied' && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Camera Access Denied
                    </Badge>
                  )}
                  {isCameraActive && (
                    <Badge className="bg-green-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription>
                Position yourself in front of the camera to see the product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                {!isCameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Camera className="h-16 w-16 mb-4 opacity-50" />
                    <P className="text-lg mb-2">Camera Not Active</P>
                    <Muted className="text-sm text-center px-4">
                      Click "Start Camera" to begin AR try-on experience
                    </Muted>
                    <Button 
                      onClick={handleStartCamera} 
                      className="mt-4"
                      disabled={cameraPermission === 'denied'}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* AR Overlay - In real implementation, this would be a 3D model overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ 
                        opacity: arOpacity[0] / 100,
                        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${selectedProduct.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        mixBlendMode: 'multiply'
                      }}
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleStopCamera}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={handleCapture}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* AR Controls */}
              {isCameraActive && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Muted className="text-sm">AR Overlay Opacity</Muted>
                      <Muted className="text-sm">{arOpacity[0]}%</Muted>
                    </div>
                    <Slider
                      value={arOpacity}
                      onValueChange={setArOpacity}
                      max={100}
                      min={0}
                      step={1}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <P className="text-sm font-semibold">{selectedProduct.name}</P>
                <P className="text-2xl font-bold">{formatPrice(selectedProduct.price)}</P>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger id="color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColors.map(color => (
                      <SelectItem key={color} value={color.toLowerCase()}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger id="size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSizes.map(size => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button onClick={handleAddToCart} className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Try-On
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
                <li>• Ensure good lighting for best results</li>
                <li>• Stand 3-5 feet from camera</li>
                <li>• Keep still while trying on</li>
                <li>• Use full screen for better view</li>
                <li>• Adjust opacity to see fit better</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ARTryOnPage;

