"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import { FavoriteButton } from "./FavoriteButton";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  badge?: string;
  stock: number;
}

interface ShopProductCardProps {
  product: Product;
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const [adding, setAdding] = useState(false);

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

    setAdding(true);
    try {
      await api.cart.add(product.id, 1);
      await refreshCart();
      toast({
        title: t("toast.addedToCart"),
        description: `${product.name} ${t("product.hasBeenAdded")}`,
      });
    } catch (error: any) {
      toast({
        title: t("toast.error"),
        description: error.message || t("common.error"),
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const handleViewProduct = () => {
    router.push(`/product/${product.slug}`);
  };

  return (
    <Card 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={handleViewProduct}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/50">
        {product.badge && (
          <Badge className="absolute top-3 left-3 z-10 bg-blue-600 text-white">
            {product.badge}
          </Badge>
        )}
        {/* Favorite Button */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton productId={product.id} size="sm" />
        </div>
        
        {product.stock === 0 && (
          <Badge className="absolute top-12 right-3 z-10 bg-red-600 text-white">
            {t("product.outOfStock")}
          </Badge>
        )}
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
      </div>

      <CardContent className="p-2 sm:p-3 flex-grow flex flex-col">
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto mb-1 sm:mb-2">
          <p className="text-base sm:text-lg font-bold text-foreground">
            {formatPrice(product.price, currency)}
          </p>
        </div>
        
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs px-2 py-2 h-8 min-w-0"
            onClick={(e) => {
              e.stopPropagation();
              handleViewProduct();
            }}
          >
            <Eye className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{t("product.view")}</span>
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs px-2 py-2 h-8 min-w-0"
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            <ShoppingCart className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">
              {adding ? t("product.adding") : t("product.addToCart")}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
