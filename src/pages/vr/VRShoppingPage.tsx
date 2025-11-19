import React, { useState } from 'react';
import { H1, P, Muted } from '@/components/ui/typography';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  ShoppingBag, 
  Users,
  Info,
  Play,
  Pause,
  Volume2,
  Settings,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const VRShoppingPage: React.FC = () => {
  const [isVRActive, setIsVRActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleEnterVR = () => {
    setIsVRActive(true);
    setIsPlaying(true);
    toast.success('Entering VR shopping experience...');
  };

  const handleExitVR = () => {
    setIsVRActive(false);
    setIsPlaying(false);
    toast.info('Exited VR mode');
  };

  return (
    <div className="space-y-6">
      <div>
        <H1 className="flex items-center gap-2">
          <Headphones className="h-8 w-8 text-primary" />
          VR Shopping Experience
        </H1>
        <P className="text-muted-foreground">
          Immerse yourself in a virtual shopping world
        </P>
      </div>

      {/* VR Status */}
      <Card className={isVRActive ? 'border-purple-500 bg-purple-500/5' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${isVRActive ? 'bg-purple-500/20' : 'bg-muted'}`}>
                <Headphones className={`h-6 w-6 ${isVRActive ? 'text-purple-500' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <P className="font-semibold">
                  {isVRActive ? 'VR Mode Active' : 'VR Mode Inactive'}
                </P>
                <Muted className="text-sm">
                  {isVRActive 
                    ? 'You are currently in virtual reality'
                    : 'Enter VR to start immersive shopping'}
                </Muted>
              </div>
            </div>
            {isVRActive ? (
              <Button variant="destructive" onClick={handleExitVR}>
                Exit VR
              </Button>
            ) : (
              <Button onClick={handleEnterVR}>
                <Headphones className="h-4 w-4 mr-2" />
                Enter VR
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* VR Experience */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>VR Shopping World</CardTitle>
              <CardDescription>
                Navigate through our virtual store in immersive 3D
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg overflow-hidden">
                {!isVRActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Headphones className="h-24 w-24 mb-6 opacity-50" />
                    <P className="text-2xl font-semibold mb-2">Ready for VR?</P>
                    <Muted className="text-center px-4 mb-6">
                      Put on your VR headset and click "Enter VR" to begin your immersive shopping experience
                    </Muted>
                    <Button size="lg" onClick={handleEnterVR}>
                      <Headphones className="h-5 w-5 mr-2" />
                      Enter VR Experience
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="mb-4">
                          <Badge className="bg-purple-500 animate-pulse mb-4">
                            <Headphones className="h-3 w-3 mr-1" />
                            VR ACTIVE
                          </Badge>
                        </div>
                        <P className="text-2xl font-semibold mb-2">Welcome to VR Shopping</P>
                        <Muted className="text-white/80">
                          Navigate with your controllers or head movement
                        </Muted>
                      </div>
                    </div>
                    {/* VR Controls Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between bg-black/60 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="secondary" size="icon">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="secondary" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={handleExitVR}>
                            Exit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* VR Features */}
          <Card>
            <CardHeader>
              <CardTitle>VR Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <P className="font-semibold mb-2">Virtual Store Navigation</P>
                  <Muted className="text-sm">
                    Walk through different sections of our virtual store using VR controllers
                  </Muted>
                </div>
                <div className="p-4 border rounded-lg">
                  <P className="font-semibold mb-2">3D Product Interaction</P>
                  <Muted className="text-sm">
                    Pick up and examine products in 3D space with full detail
                  </Muted>
                </div>
                <div className="p-4 border rounded-lg">
                  <P className="font-semibold mb-2">Social Shopping</P>
                  <Muted className="text-sm">
                    Shop with friends in the same virtual space
                  </Muted>
                </div>
                <div className="p-4 border rounded-lg">
                  <P className="font-semibold mb-2">Immersive Try-On</P>
                  <Muted className="text-sm">
                    Try on products in virtual reality before purchasing
                  </Muted>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VR Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <P className="text-sm font-semibold">VR Headset</P>
                  <Muted className="text-xs">Oculus, HTC Vive, or compatible</Muted>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <P className="text-sm font-semibold">Controllers</P>
                  <Muted className="text-xs">Motion controllers for interaction</Muted>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <P className="text-sm font-semibold">Play Space</P>
                  <Muted className="text-xs">Minimum 2m × 2m recommended</Muted>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>VR Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ensure adequate play space</li>
                <li>• Use controllers for navigation</li>
                <li>• Take breaks every 30 minutes</li>
                <li>• Adjust settings for comfort</li>
                <li>• Try different store sections</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <P className="font-semibold mb-1">Desktop Mode Available</P>
                  <Muted className="text-sm">
                    Don't have a VR headset? You can still explore our virtual showroom on desktop.
                  </Muted>
                  <Link to="/vr/showroom">
                    <Button variant="outline" size="sm" className="mt-3">
                      Try Desktop Mode
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VRShoppingPage;

