import React, { useState } from 'react';
import { Product } from '@/data/dummyData';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import Product360View from './Product360View';

interface ProductImageGalleryProps {
  product: Product;
  onClose?: () => void;
  isModal?: boolean;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ product, isModal = false, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [show360, setShow360] = useState(false);

  const images = product.images && product.images.length > 0
    ? [product.imageUrl, ...product.images]
    : [product.imageUrl];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const GalleryContent = () => (
    <div className="relative w-full">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
        <img
          src={images[selectedIndex]}
          alt={`${product.name} - View ${selectedIndex + 1}`}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={toggleZoom}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleZoom}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </Button>
          {(images.length >= 8 || product.videoUrl) && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setShow360(true)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 360° View Indicator */}
        {(images.length >= 8 || product.videoUrl) && (
          <div className="absolute bottom-4 left-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShow360(true)}
              className="bg-background/80 backdrop-blur-sm"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              {images.length >= 8 ? '360° View' : 'Video Tour'}
            </Button>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                index === selectedIndex
                  ? 'border-accent-gold ring-2 ring-accent-gold/20'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <img
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 360° View Dialog */}
      {show360 && images.length >= 8 && (
        <Dialog open={show360} onOpenChange={setShow360}>
          <DialogContent className="max-w-4xl p-0">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">360° View - {product.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShow360(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Product360View
                images={images}
                productName={product.name}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Video Dialog (if videoUrl exists) */}
      {show360 && product.videoUrl && images.length < 8 && (
        <Dialog open={show360} onOpenChange={setShow360}>
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
                onClick={() => setShow360(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );

  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl p-0">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <GalleryContent />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <GalleryContent />;
};

export default ProductImageGallery;

