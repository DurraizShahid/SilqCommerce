import React, { useState } from 'react';
import { Product } from '@/data/dummyData';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Play, X, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import ProductImageGallery from './ProductImageGallery';

interface ProductMediaViewerProps {
  product: Product;
}

const ProductMediaViewer: React.FC<ProductMediaViewerProps> = ({ product }) => {
  // Use the enhanced ProductImageGallery component
  return <ProductImageGallery product={product} />;
};

// Legacy implementation kept for backward compatibility
const ProductMediaViewerLegacy: React.FC<ProductMediaViewerProps> = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const images = product.images && product.images.length > 0 
    ? [product.imageUrl, ...product.images] 
    : [product.imageUrl];

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
        <img
          src={images[selectedImageIndex]}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsZoomed(!isZoomed)}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </Button>
          {product.videoUrl && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsVideoOpen(true)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === selectedImageIndex
                    ? 'bg-accent-gold w-6'
                    : 'bg-background/50 hover:bg-background/80'
                }`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                index === selectedImageIndex
                  ? 'border-accent-gold'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Video Dialog */}
      {product.videoUrl && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <DialogContent className="max-w-4xl p-0">
            <div className="relative aspect-video">
              <iframe
                src={product.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
                onClick={() => setIsVideoOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductMediaViewer;

