import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCw, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { P } from '@/components/ui/typography';

interface Product360ViewProps {
  images: string[];
  productName?: string;
  className?: string;
}

const Product360View: React.FC<Product360ViewProps> = ({
  images,
  productName,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 0.5;
    const newIndex = Math.round(
      (currentIndex - (deltaX * sensitivity) / 10 + images.length) % images.length
    );
    setCurrentIndex(newIndex);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 0.5;
    const newIndex = Math.round(
      (currentIndex - (deltaX * sensitivity) / 10 + images.length) % images.length
    );
    setCurrentIndex(newIndex);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleRotate = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(1, Math.min(3, prev + delta)));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (images.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-12 text-center">
          <P className="text-muted-foreground">No 360° view images available</P>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden ${className}`} ref={containerRef}>
      <CardContent className="p-0">
        <div className="relative aspect-square bg-black">
          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`${productName} - View ${currentIndex + 1}`}
            className="w-full h-full object-contain cursor-grab active:cursor-grabbing select-none"
            style={{ transform: `scale(${zoom})` }}
            draggable={false}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 rounded-lg p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRotate('left')}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <RotateCw className="h-4 w-4 rotate-180" />
            </Button>
            <div className="flex items-center gap-1 px-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRotate('right')}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleZoom(0.2)}
              className="bg-black/70 text-white hover:bg-black/90 h-8 w-8"
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleZoom(-0.2)}
              className="bg-black/70 text-white hover:bg-black/90 h-8 w-8"
              disabled={zoom <= 1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="bg-black/70 text-white hover:bg-black/90 h-8 w-8"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* 360° Badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="default" className="bg-primary/90">
              <RotateCw className="h-3 w-3 mr-1" />
              360° View
            </Badge>
          </div>

          {/* Instructions */}
          {!isDragging && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <P className="text-white/70 text-sm text-center">
                Click and drag to rotate
              </P>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Product360View;

