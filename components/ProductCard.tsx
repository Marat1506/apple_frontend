"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "./FavoriteButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface ProductCardProps {
  id: string;
  name: string;
  tagline: string;
  price: string;
  badge?: string;
  gradient: string;
  image?: string | null;
  images?: string[];
  slug?: string;
}

const ProductCard = ({ id, name, tagline, price, badge, gradient, image, images, slug }: ProductCardProps) => {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Get all images - prioritize images array, fallback to single image
  // Filter out empty strings, null values, and undefined
  const filteredImages = images && Array.isArray(images) 
    ? images.filter(img => img && typeof img === 'string' && img.trim() !== '') 
    : [];
  
  const allImages = filteredImages.length > 0 
    ? filteredImages 
    : (image && typeof image === 'string' && image.trim() !== '' ? [image] : []);
  
  // Only show indicators if there are actually 2 or more valid images
  const hasMultipleImages = allImages.length > 1;

  const handleClick = () => {
    if (slug) {
      router.push(`/product/${slug}`);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: t("toast.signInRequired"),
        description: t("toast.signInToAddToCart"),
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }

    setIsAddingToCart(true);
    try {
      await api.cart.add(id, 1);
      await refreshCart();
      toast({
        title: t("toast.addedToCart"),
        description: `${name} ${t("product.hasBeenAdded")}`,
      });
    } catch (error: any) {
      toast({
        title: t("toast.error"),
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe left - next image
        nextImage();
      } else {
        // Swipe right - previous image
        prevImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <Card className="group overflow-hidden hover-lift border-border/50 bg-card cursor-pointer h-full flex flex-col">
      <CardHeader className="relative h-64 p-0 overflow-hidden">
        <div 
          ref={imageContainerRef}
          className={`w-full h-full ${gradient} flex items-center justify-center relative bg-background`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {badge && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground z-10">
              {badge}
            </Badge>
          )}
          
          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton productId={id} size="sm" />
          </div>

          {/* Product images carousel */}
          {allImages.length > 0 ? (
            <div className="relative w-full h-full overflow-hidden">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${name} - ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading={index === 0 ? "lazy" : "lazy"}
                  onClick={handleImageClick}
                />
              ))}
            </div>
          ) : (
            <div className="w-40 h-40 rounded-3xl bg-background/20 backdrop-blur-sm animate-float" />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
        </div>

        {/* Carousel indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/50 hover:bg-muted-foreground'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6 space-y-3 flex-grow">
        <h3 className="text-xl font-bold text-foreground leading-tight text-center">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 text-center">{tagline}</p>
        {price && <p className="text-lg font-semibold text-foreground pt-1 text-center">{price}</p>}
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-3 justify-center">
        <Button 
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {t("product.learnMore")}
        </Button>
        <Button 
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 rounded-full px-6"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? t("product.adding") : t("product.addToCartShort")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
