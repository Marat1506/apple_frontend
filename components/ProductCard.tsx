"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";

interface ProductCardProps {
  id: string;
  name: string;
  tagline: string;
  price: string;
  badge?: string;
  gradient: string;
  image?: string | null;
  slug?: string;
}

const ProductCard = ({ id, name, tagline, price, badge, gradient, image, slug }: ProductCardProps) => {
  const router = useRouter();

  // Color options for products (can be made dynamic later)
  const colorOptions = [
    { color: "#FF6B35", name: "orange" },
    { color: "#4ECDC4", name: "blue" },
    { color: "#C7CEEA", name: "purple" },
    { color: "#FFE66D", name: "yellow" },
  ];

  const handleClick = () => {
    if (slug) {
      router.push(`/product/${slug}`);
    }
  };

  return (
    <Card className="group overflow-hidden hover-lift border-border/50 bg-card cursor-pointer h-full flex flex-col">
      <CardHeader className="relative h-64 p-0 overflow-hidden" onClick={handleClick}>
        <div className={`w-full h-full ${gradient} flex items-center justify-center relative bg-background`}>
          {badge && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground z-10">
              {badge}
            </Badge>
          )}
          
          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton productId={id} size="sm" />
          </div>
          {/* Product image */}
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-40 h-40 rounded-3xl bg-background/20 backdrop-blur-sm animate-float" />
          )}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
      </CardHeader>
      
      <CardContent className="p-6 space-y-3 flex-grow">
        <h3 className="text-xl font-bold text-foreground leading-tight">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{tagline}</p>
        <p className="text-lg font-semibold text-foreground pt-1">{price}</p>
        
        {/* Color dots */}
        <div className="flex gap-2 pt-2">
          {colorOptions.slice(0, 4).map((option, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full border border-border/50"
              style={{ backgroundColor: option.color }}
              title={option.name}
            />
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
        <Button 
          variant="link" 
          className="p-0 h-auto text-primary hover:text-primary/80 group/btn"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Learn more
        </Button>
        <Button 
          variant="link" 
          className="p-0 h-auto text-primary hover:text-primary/80 group/btn flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Buy
          <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
