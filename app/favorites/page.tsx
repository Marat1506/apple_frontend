"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatPrice } from "@/lib/currency";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description?: string;
  badge?: string;
}

interface Favorite {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { removeFromFavorites } = useFavorites();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    fetchFavorites();
  }, [user, router]);

  const fetchFavorites = async () => {
    try {
      const data = await api.favorites.getAll();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    await removeFromFavorites(productId);
    setFavorites(prev => prev.filter(fav => fav.productId !== productId));
  };

  const addToCart = async (product: Product) => {
    if (!user) {
      toast({
        title: t("toast.signInRequired"),
        description: t("toast.signInToAddToCart"),
        variant: "destructive",
      });
      return;
    }

    try {
      await api.cart.add(product.id);
      toast({
        title: t("toast.addedToCart"),
        description: `${product.name} ${t("product.hasBeenAdded")}`,
      });
    } catch (error: any) {
      toast({
        title: t("toast.error"),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-16 md:pb-0">
        <Navigation />
        <main className="pt-20 pb-16">
          <div className="px-8 sm:px-12 lg:px-16">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="px-8 sm:px-12 lg:px-16">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t("favorites.title")}
            </h1>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {t("favorites.noFavorites")}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t("favorites.noFavoritesDescription")}
              </p>
              <Button asChild>
                <Link href="/shop">{t("favorites.browseProducts")}</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8">
                {favorites.length} {favorites.length === 1 ? t("favorites.itemCount") : t("favorites.itemsCount")} {t("favorites.inYourFavorites")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((favorite) => (
                  <Card key={favorite.id} className="group overflow-hidden">
                    <div className="relative">
                      <Link href={`/products/${favorite.product.slug}`}>
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={favorite.product.images?.[0] || "/placeholder.svg"}
                            alt={favorite.product.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      </Link>
                      
                      {favorite.product.badge && (
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                          {favorite.product.badge}
                        </div>
                      )}

                      <button
                        onClick={() => handleRemoveFromFavorites(favorite.product.id)}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    <CardContent className="p-4">
                      <Link href={`/products/${favorite.product.slug}`}>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {favorite.product.name}
                        </h3>
                      </Link>
                      
                      {favorite.product.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {favorite.product.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(favorite.product.price, currency)}
                        </span>
                        
                        <Button
                          size="sm"
                          onClick={() => addToCart(favorite.product)}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {t("product.addToCart")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}