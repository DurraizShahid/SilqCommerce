import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Sparkles, 
  Camera, 
  RotateCcw, 
  Download, 
  Share2,
  ShoppingCart,
  Palette,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { products } from '@/data/dummyData';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';

const ARMakeupPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    return products.find(p => p.id === productId) || products[0];
  });
  const [makeupType, setMakeupType] = useState<'lipstick' | 'eyeshadow' | 'blush' | 'foundation'>('lipstick');
  const [selectedColor, setSelectedColor] = useState('#FF6B9D');
  const [intensity, setIntensity] = useState([50]);
  const [isApplied, setIsApplied] = useState(false);

  const makeupColors = {
    lipstick: ['#FF6B9D', '#C41E3A', '#8B0000', '#FF1493', '#DC143C'],
    eyeshadow: ['#4B0082', '#8A2BE2', '#9370DB', '#BA55D3', '#DA70D6'],
    blush: ['#FFB6C1', '#FF69B4', '#FF1493', '#FFC0CB', '#FF69B4'],
    foundation: ['#F5DEB3', '#DEB887', '#D2B48C', '#BC8F8F', '#A0522D'],
  };

  useEffect(() => {
    if (makeupColors[makeupType]) {
      setSelectedColor(makeupColors[makeupType][0]);
    }
  }, [makeupType]);

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
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
      setIsApplied(false);
    }
  };

  const handleApplyMakeup = () => {
    setIsApplied(true);
    toast.success('Makeup applied! Adjust intensity and color.');
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
        // In real implementation, makeup overlay would be drawn here
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ar-makeup-${Date.now()}.png`;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <H1 className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AR Makeup Try-On
          </H1>
          <P className="text-muted-foreground">
            Try on {selectedProduct.name} virtually
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
                <CardTitle>AR Makeup Preview</CardTitle>
                {isApplied && (
                  <Badge className="bg-green-500 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Applied
                  </Badge>
                )}
              </div>
              <CardDescription>
                See how the makeup looks on you in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                {!isCameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Sparkles className="h-16 w-16 mb-4 opacity-50" />
                    <P className="text-lg mb-2">Camera Not Active</P>
                    <Muted className="text-sm text-center px-4 mb-4">
                      Click "Start Camera" to begin AR makeup try-on
                    </Muted>
                    <Button onClick={handleStartCamera}>
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
                    {/* Makeup Overlay */}
                    {isApplied && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at center, ${selectedColor}${Math.round(intensity[0] * 2.55).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                          mixBlendMode: 'multiply',
                        }}
                      />
                    )}
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

              {/* Makeup Controls */}
              {isCameraActive && (
                <div className="mt-4 space-y-4">
                  {!isApplied ? (
                    <Button onClick={handleApplyMakeup} className="w-full">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Apply Makeup
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Intensity</Label>
                          <Muted className="text-sm">{intensity[0]}%</Muted>
                        </div>
                        <Slider
                          value={intensity}
                          onValueChange={setIntensity}
                          max={100}
                          min={0}
                          step={1}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Product Controls */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Makeup Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Makeup Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['lipstick', 'eyeshadow', 'blush', 'foundation'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={makeupType === type ? 'default' : 'outline'}
                      onClick={() => setMakeupType(type)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                  {makeupColors[makeupType].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <P className="font-semibold">{selectedProduct.name}</P>
                <P className="text-2xl font-bold">{formatPrice(selectedProduct.price)}</P>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button onClick={handleAddToCart} className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Look
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ensure good lighting</li>
                <li>• Keep face centered</li>
                <li>• Adjust intensity to preference</li>
                <li>• Try different colors</li>
                <li>• Save your favorite looks</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ARMakeupPage;

